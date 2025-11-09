import { cacheConfig } from './config';
import type { CacheMetrics, CacheMetricsSnapshot } from './types';

type NumericMetricKey = 'hits' | 'misses' | 'sets' | 'deletes' | 'evictions';

let mut_metrics: CacheMetrics = {
  hits: 0,
  misses: 0,
  sets: 0,
  deletes: 0,
  evictions: 0,
  lastForcedPurgeAt: null,
  lastMemoryUsageBytes: 0,
};

const updateMetrics = (updates: Partial<CacheMetrics>) => {
  mut_metrics = {
    ...mut_metrics,
    ...updates,
  };
};

const increment = (key: NumericMetricKey, value = 1) => {
  updateMetrics({ [key]: mut_metrics[key] + value } as Partial<CacheMetrics>);
};

export const metricsStore = {
  hit() {
    increment('hits');
  },
  miss() {
    increment('misses');
  },
  set() {
    increment('sets');
  },
  delete(count = 1) {
    increment('deletes', count);
  },
  eviction() {
    increment('evictions');
  },
  updateMemoryUsage(bytes: number) {
    updateMetrics({ lastMemoryUsageBytes: bytes });
  },
  markForcedPurge(timestamp: number) {
    updateMetrics({ lastForcedPurgeAt: timestamp });
  },
  snapshot(entryCount: number): CacheMetricsSnapshot {
    return {
      ...mut_metrics,
      entryCount,
      maxEntries: cacheConfig.maxEntries,
      ttlMs: cacheConfig.ttlMs,
    };
  },
};
