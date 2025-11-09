import type { NamespacedCacheEntry } from '../types';

export function createNamespacedCacheEntry<TResult>(
  marker: symbol,
  value: TResult,
): NamespacedCacheEntry<TResult> {
  return { marker, value };
}

export function isNamespacedCacheEntry<TResult>(
  candidate: unknown,
  marker: symbol,
): candidate is NamespacedCacheEntry<TResult> {
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }

  const entry = candidate as Partial<NamespacedCacheEntry<TResult>>;
  return entry.marker === marker && 'value' in entry;
}
