const HANDLE_STORE_SYMBOL = Symbol.for('cacheMemoryMonitorHandleStore');
const MONITOR_HANDLE_KEY = Symbol.for('memoryMonitorHandle');

type HandleStore = Map<typeof MONITOR_HANDLE_KEY, NodeJS.Timeout>;

const isHandleStore = (value: unknown): value is HandleStore => value instanceof Map;

const resolveHandleStore = (): HandleStore => {
  const existingStore: unknown = Reflect.get(globalThis, HANDLE_STORE_SYMBOL);
  if (isHandleStore(existingStore)) {
    return existingStore;
  }

  const store: HandleStore = new Map();
  Reflect.set(globalThis, HANDLE_STORE_SYMBOL, store);
  return store;
};

const handleStore = resolveHandleStore();

export const getMonitorHandle = () => handleStore.get(MONITOR_HANDLE_KEY);

export const setMonitorHandle = (handle: NodeJS.Timeout) => {
  handleStore.set(MONITOR_HANDLE_KEY, handle);
};

export const clearMonitorHandle = () => {
  handleStore.delete(MONITOR_HANDLE_KEY);
};
