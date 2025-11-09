import type { CacheStoreValue, NullSentinel, UndefinedSentinel } from '../types';

export const NULL_SENTINEL: NullSentinel = { type: 'cache:null' } as const;
export const UNDEFINED_SENTINEL: UndefinedSentinel = { type: 'cache:undefined' } as const;

export function toStoreValue(value: unknown): CacheStoreValue {
  if (value === null) {
    return NULL_SENTINEL;
  }

  if (value === undefined) {
    return UNDEFINED_SENTINEL;
  }

  return value as CacheStoreValue;
}

export function fromStoreValue(value: CacheStoreValue): unknown {
  if (value === NULL_SENTINEL) {
    return null;
  }

  if (value === UNDEFINED_SENTINEL) {
    return undefined;
  }

  return value;
}
