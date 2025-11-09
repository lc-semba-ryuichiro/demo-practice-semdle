import { cacheConfig } from './config';
import { metricsStore } from './metrics';

type MemoryMonitorDeps = {
  enforceBudget: () => number;
  formatBytes: (bytes: number) => string;
};

export function startMemoryMonitor({ enforceBudget, formatBytes }: MemoryMonitorDeps) {
  if (!cacheConfig.monitoringEnabled || cacheConfig.memoryThresholdBytes <= 0) {
    return;
  }

  const interval = setInterval(() => {
    const rss = process.memoryUsage().rss;
    metricsStore.updateMemoryUsage(rss);

    if (rss < cacheConfig.memoryThresholdBytes) {
      return;
    }

    const removed = enforceBudget();
    if (removed === 0) {
      return;
    }

    metricsStore.markForcedPurge(Date.now());
    console.warn(
      `cache memory threshold exceeded (rss=${formatBytes(rss)}, ` +
        `threshold=${formatBytes(cacheConfig.memoryThresholdBytes)}). ` +
        `Evicted ${removed} entr${removed === 1 ? 'y' : 'ies'} via ${cacheConfig.clearStrategy}.`,
    );
  }, cacheConfig.monitorIntervalMs);

  if (typeof interval.unref === 'function') {
    interval.unref();
  }
}
