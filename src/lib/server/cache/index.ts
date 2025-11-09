'use server';

import { cacheConfig } from './config';
import { startMemoryMonitor } from './memory-monitor';
import { metricsStore } from './metrics';
import type { CacheMetricsSnapshot, CacheSetOptions, WithUnstableCacheOptions } from './types';
import { LRUCache } from 'lru-cache';
import { unstable_cache } from 'next/cache';

const KEY_SEPARATOR = '::';
const MEMORY_TRIM_FRACTION = 0.25;

const NULL_SENTINEL = { type: 'cache:null' } as const;
const UNDEFINED_SENTINEL = { type: 'cache:undefined' } as const;

type CachePrimitive = string | number | boolean | bigint | symbol;
type CacheStoreValue = CachePrimitive | object | typeof NULL_SENTINEL | typeof UNDEFINED_SENTINEL;
type NamespacedCacheEntry<TResult> = {
  marker: symbol;
  value: TResult;
};

const registry = new LRUCache<string, CacheStoreValue>({
  max: cacheConfig.maxEntries,
  ttl: cacheConfig.ttlMs > 0 ? cacheConfig.ttlMs : 0,
  ttlAutopurge: cacheConfig.ttlMs > 0,
  updateAgeOnGet: true,
  allowStale: false,
  dispose: (_value, _key, reason) => {
    if (reason === 'evict' || reason === 'expire') {
      metricsStore.eviction();
    }
  },
});

startMemoryMonitor({
  enforceBudget: () => enforceMemoryBudget(),
  formatBytes,
});

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

      const result = await fn(...args);
      cacheSet(
        storageKey,
        createNamespacedCacheEntry(entryMarker, result),
        ttlMs !== undefined ? { ttl: ttlMs } : undefined,
      );
      return result;
    },
    keyParts,
    unstableOptions,
  );

  return async (...args: TArgs) => cachedFn(...args);
}

function resolveSetOptions(options?: CacheSetOptions) {
  const ttl = options?.ttl ?? (cacheConfig.ttlMs > 0 ? cacheConfig.ttlMs : undefined);
  return ttl !== undefined ? { ttl } : undefined;
}

function enforceMemoryBudget(): number {
  if (cacheConfig.clearStrategy === 'clear') {
    return cacheClear();
  }

  return trimLeastRecentlyUsed();
}

function trimLeastRecentlyUsed(): number {
  const toRemove = Math.ceil(registry.size * MEMORY_TRIM_FRACTION);
  if (toRemove <= 0) {
    return 0;
  }

  const keysToTrim = Array.from(registry.rkeys()).slice(0, toRemove);
  return keysToTrim.reduce((removedCount, key) => {
    if (!registry.delete(key)) {
      return removedCount;
    }

    metricsStore.delete();
    return removedCount + 1;
  }, 0);
}

function composeKey(parts: Array<string | number | boolean>) {
  return parts.map((part) => String(part)).join(KEY_SEPARATOR);
}

function defaultArgsToKey(...args: unknown[]): string {
  try {
    return JSON.stringify(args);
  } catch {
    return args.map((arg) => String(arg)).join(KEY_SEPARATOR);
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes.toFixed(0)}B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'] as const;
  const exponent = Math.max(1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const unitIndex = Math.min(units.length - 1, exponent - 1);
  const value = bytes / 1024 ** (unitIndex + 1);
  const unit = units[unitIndex] ?? units[0];
  return `${value.toFixed(1)}${unit}`;
}

function createNamespacedCacheEntry<TResult>(
  marker: symbol,
  value: TResult,
): NamespacedCacheEntry<TResult> {
  return { marker, value };
}

function isNamespacedCacheEntry<TResult>(
  value: unknown,
  marker: symbol,
): value is NamespacedCacheEntry<TResult> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const entry = value as Partial<NamespacedCacheEntry<TResult>>;
  return entry.marker === marker && 'value' in entry;
}

function toStoreValue(value: unknown): CacheStoreValue {
  if (value === null) {
    return NULL_SENTINEL;
  }

  if (value === undefined) {
    return UNDEFINED_SENTINEL;
  }

  return value as CacheStoreValue;
}

function fromStoreValue(value: CacheStoreValue): unknown {
  if (value === NULL_SENTINEL) {
    return null;
  }

  if (value === UNDEFINED_SENTINEL) {
    return undefined;
  }

  return value;
}
