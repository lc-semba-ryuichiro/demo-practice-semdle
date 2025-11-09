import { cacheConfig } from './config';
import {
  clearMonitorHandle,
  getMonitorHandle,
  setMonitorHandle,
} from './memory-monitor/handle-store';
import { metricsStore } from './metrics';

type MemoryMonitorDeps = {
  enforceBudget: () => number;
  formatBytes: (bytes: number) => string;
};

export function stopMemoryMonitor() {
  const handle = getMonitorHandle();
  if (handle === undefined) {
    return;
  }

  clearInterval(handle);
  clearMonitorHandle();
}

export function startMemoryMonitor({ enforceBudget, formatBytes }: MemoryMonitorDeps) {
  if (!cacheConfig.monitoringEnabled || cacheConfig.memoryThresholdBytes <= 0) {
    stopMemoryMonitor();
    return;
  }

  stopMemoryMonitor();

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

  setMonitorHandle(interval);

  if (typeof interval.unref === 'function') {
    interval.unref();
  }
}
