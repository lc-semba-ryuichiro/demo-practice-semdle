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

export type NullSentinel = Readonly<{ type: 'cache:null' }>;
export type UndefinedSentinel = Readonly<{ type: 'cache:undefined' }>;
export type CachePrimitive = string | number | boolean | bigint | symbol;
export type CacheStoreValue = CachePrimitive | object | NullSentinel | UndefinedSentinel;

export type NamespacedCacheEntry<TResult> = {
  marker: symbol;
  value: TResult;
};

export type PendingRequestEntry<TResult = unknown> = {
  marker: symbol;
  promise: Promise<TResult>;
};

export type PendingRequestStore = Map<string, PendingRequestEntry>;
