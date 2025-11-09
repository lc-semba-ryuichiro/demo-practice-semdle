import { cacheConfig } from '../config';
import { metricsStore } from '../metrics';
import type { CacheSetOptions, CacheStoreValue } from '../types';
import { MEMORY_TRIM_FRACTION } from './constants';
import { LRUCache } from 'lru-cache';

export const registry = new LRUCache<string, CacheStoreValue>({
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

export function resolveSetOptions(options?: CacheSetOptions) {
  const ttl = options?.ttl ?? (cacheConfig.ttlMs > 0 ? cacheConfig.ttlMs : undefined);
  return ttl !== undefined ? { ttl } : undefined;
}

export function trimLeastRecentlyUsed(): number {
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
