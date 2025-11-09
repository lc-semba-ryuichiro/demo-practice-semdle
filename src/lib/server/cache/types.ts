export type CacheMetrics = {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  lastForcedPurgeAt: number | null;
  lastMemoryUsageBytes: number;
};

export type CacheMetricsSnapshot = CacheMetrics & {
  entryCount: number;
  maxEntries: number;
  ttlMs: number;
};

export type CacheSetOptions = {
  ttl?: number;
};

export type NextCacheOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export type WithUnstableCacheOptions<TArgs extends unknown[]> = NextCacheOptions & {
  argsToKey?: (...args: TArgs) => string;
  ttlMs?: number;
};
