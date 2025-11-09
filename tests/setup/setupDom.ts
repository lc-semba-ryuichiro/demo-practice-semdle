import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from 'node:util';

const createMemoryStorage = (): Storage => {
  const store = new Map<string, string>();

  const storage = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      const value = store.get(key);
      return typeof value === 'undefined' ? null : value;
    },
    key(index: number) {
      const keys = Array.from(store.keys());
      const value = keys[index];
      return typeof value === 'undefined' ? null : value;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  } satisfies Storage;

  return storage;
};

const isStorage = (value: unknown): value is Storage => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return ['getItem', 'setItem', 'removeItem', 'clear'].every(
    (method) => typeof Reflect.get(value, method) === 'function',
  );
};

const ensureStorage = (property: 'localStorage' | 'sessionStorage') => {
  const storageCandidate = Reflect.get(globalThis, property);

  if (!isStorage(storageCandidate)) {
    Object.defineProperty(globalThis, property, {
      configurable: true,
      writable: true,
      value: createMemoryStorage(),
    });
  }
};

if (typeof globalThis.TextEncoder === 'undefined') {
  Object.defineProperty(globalThis, 'TextEncoder', {
    configurable: true,
    writable: true,
    value: NodeTextEncoder,
  });
}

if (typeof globalThis.TextDecoder === 'undefined') {
  Object.defineProperty(globalThis, 'TextDecoder', {
    configurable: true,
    writable: true,
    value: NodeTextDecoder,
  });
}

ensureStorage('localStorage');
ensureStorage('sessionStorage');
