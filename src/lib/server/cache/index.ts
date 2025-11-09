'use server';

import { cacheConfig } from './config';
import { composeKey } from './internal/compose-key';
import { formatBytes } from './internal/format-bytes';
import { createNamespacedCacheEntry, isNamespacedCacheEntry } from './internal/namespaced-entry';
import {
  createPendingRequestEntry,
  getPendingRequestStore,
  isPendingRequestEntryOf,
} from './internal/pending-request-store';
import { registry, resolveSetOptions, trimLeastRecentlyUsed } from './internal/registry';
import { defaultArgsToKey } from './internal/serializer';
import { fromStoreValue, toStoreValue } from './internal/store-value';
import { startMemoryMonitor, stopMemoryMonitor } from './memory-monitor';
import { metricsStore } from './metrics';
import type {
  CacheMetricsSnapshot,
  CacheSetOptions,
  NamespacedCacheEntry,
  PendingRequestEntry,
  WithUnstableCacheOptions,
} from './types';
import { unstable_cache } from 'next/cache';

const pendingRequestsStore = getPendingRequestStore();

stopMemoryMonitor();

if (cacheConfig.monitoringEnabled) {
  startMemoryMonitor({
    enforceBudget: () => enforceMemoryBudget(),
    formatBytes,
  });
}

export function cacheGet(key: string): unknown;
export function cacheGet<T>(key: string, validate: (value: unknown) => value is T): T | undefined;
export function cacheGet<T>(key: string, validate?: (value: unknown) => value is T) {
  const storedEntry = registry.get(key);

  if (storedEntry === undefined) {
    metricsStore.miss();
    return undefined;
  }

  const value = fromStoreValue(storedEntry);

  if (validate !== undefined && !validate(value)) {
    registry.delete(key);
    metricsStore.delete();
    metricsStore.miss();
    return undefined;
  }

  metricsStore.hit();
  return value;
}

export function cacheSet<T>(key: string, value: T, options?: CacheSetOptions): T {
  const setOptions = resolveSetOptions(options);
  const storedValue = toStoreValue(value);
  if (setOptions !== undefined) {
    registry.set(key, storedValue, setOptions);
  } else {
    registry.set(key, storedValue);
  }

  metricsStore.set();
  return value;
}

export function cacheDelete(key: string): boolean {
  const deleted = registry.delete(key);
  if (deleted) {
    metricsStore.delete();
  }

  return deleted;
}

export function cacheClear(prefix?: string): number {
  if (prefix === undefined) {
    const removed = registry.size;
    registry.clear();
    metricsStore.delete(removed);
    return removed;
  }

  const keysToRemove = Array.from(registry.keys()).filter((key) => key.startsWith(prefix));
  return keysToRemove.reduce((deletedCount, key) => {
    if (!registry.delete(key)) {
      return deletedCount;
    }

    metricsStore.delete();
    return deletedCount + 1;
  }, 0);
}

export function getCacheMetrics(): CacheMetricsSnapshot {
  return metricsStore.snapshot(registry.size);
}

export function withUnstableCache<TArgs extends unknown[], TResult>(
  keyParts: string[],
  fn: (...args: TArgs) => Promise<TResult>,
  options?: WithUnstableCacheOptions<TArgs>,
): (...args: TArgs) => Promise<TResult> {
  const { argsToKey = defaultArgsToKey, ttlMs, ...nextOptions } = options ?? {};
  const namespace = keyParts.length > 0 ? composeKey(keyParts) : 'cache';
  const hasNextOptions =
    typeof nextOptions.revalidate !== 'undefined' || nextOptions.tags !== undefined;
  const unstableOptions = hasNextOptions ? nextOptions : undefined;
  const entryMarker = Symbol(namespace);

  const cachedFn = unstable_cache(
    async (...args: TArgs) => {
      const argsKey = argsToKey(...args);
      const storageKey = composeKey([namespace, argsKey]);
      const cachedEntry = cacheGet(storageKey, (value): value is NamespacedCacheEntry<TResult> =>
        isNamespacedCacheEntry<TResult>(value, entryMarker),
      );

      if (cachedEntry !== undefined) {
        return cachedEntry.value;
      }

      const pendingEntry = pendingRequestsStore.get(storageKey);
      if (isPendingRequestEntryOf<TResult>(pendingEntry, entryMarker)) {
        return pendingEntry.promise;
      }

      const execution = (async () => {
        const result = await fn(...args);
        cacheSet(
          storageKey,
          createNamespacedCacheEntry(entryMarker, result),
          ttlMs !== undefined ? { ttl: ttlMs } : undefined,
        );
        return result;
      })();

      const nextEntry: PendingRequestEntry<TResult> = createPendingRequestEntry(
        entryMarker,
        execution,
      );
      pendingRequestsStore.set(storageKey, nextEntry);
      try {
        return await execution;
      } finally {
        const currentEntry = pendingRequestsStore.get(storageKey);
        if (isPendingRequestEntryOf<TResult>(currentEntry, entryMarker)) {
          pendingRequestsStore.delete(storageKey);
        }
      }
    },
    keyParts,
    unstableOptions,
  );

  return async (...args: TArgs) => cachedFn(...args);
}

function enforceMemoryBudget(): number {
  if (cacheConfig.clearStrategy === 'clear') {
    return cacheClear();
  }

  return trimLeastRecentlyUsed();
}
