import type { PendingRequestEntry, PendingRequestStore } from '../types';

const PENDING_REQUEST_STORE_SYMBOL = Symbol.for('cachePendingRequestStore');

const isPendingRequestStore = (value: unknown): value is PendingRequestStore =>
  value instanceof Map;

export function getPendingRequestStore(): PendingRequestStore {
  const existingStore: unknown = Reflect.get(globalThis, PENDING_REQUEST_STORE_SYMBOL);
  if (isPendingRequestStore(existingStore)) {
    return existingStore;
  }

  const store: PendingRequestStore = new Map();
  Reflect.set(globalThis, PENDING_REQUEST_STORE_SYMBOL, store);
  return store;
}

export function createPendingRequestEntry<TResult>(
  marker: symbol,
  promise: Promise<TResult>,
): PendingRequestEntry<TResult> {
  return { marker, promise };
}

export function isPendingRequestEntryOf<TResult>(
  entry: PendingRequestEntry | undefined,
  marker: symbol,
): entry is PendingRequestEntry<TResult> {
  return entry?.marker === marker;
}
