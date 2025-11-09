import { env } from '@/config/env';

const BYTES_PER_MB = 1024 * 1024;

export const cacheConfig = {
  maxEntries: env.server.CACHE_MAX_ENTRIES,
  ttlMs: env.server.CACHE_TTL_MS,
  memoryThresholdBytes: env.server.CACHE_MEMORY_THRESHOLD_MB * BYTES_PER_MB,
  monitorIntervalMs: env.server.CACHE_MEMORY_CHECK_INTERVAL_MS,
  monitoringEnabled: env.server.CACHE_ENABLE_MONITORING,
  clearStrategy: env.server.CACHE_MEMORY_CLEAR_STRATEGY,
} as const;
