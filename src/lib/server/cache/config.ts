import { envServer } from '@/config/env.server';

const BYTES_PER_MB = 1024 * 1024;

export const cacheConfig = {
  maxEntries: envServer.CACHE_MAX_ENTRIES,
  ttlMs: envServer.CACHE_TTL_MS,
  memoryThresholdBytes: envServer.CACHE_MEMORY_THRESHOLD_MB * BYTES_PER_MB,
  monitorIntervalMs: envServer.CACHE_MEMORY_CHECK_INTERVAL_MS,
  monitoringEnabled: envServer.CACHE_ENABLE_MONITORING,
  clearStrategy: envServer.CACHE_MEMORY_CLEAR_STRATEGY,
} as const;
