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
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, property);

  if (typeof descriptor?.value !== 'undefined') {
    if (isStorage(descriptor.value)) {
      return;
    }
  } else if (typeof descriptor?.get === 'function') {
    // Node.js 22 以降は Web Storage の getter を実験的に提供しており、
    // `--localstorage-file` を付けずにアクセスすると警告が出るため、
    // getter が呼ばれる前に強制的にメモリ実装へすり替える。
    Object.defineProperty(globalThis, property, {
      configurable: true,
      writable: true,
      value: createMemoryStorage(),
    });
    return;
  } else {
    const storageCandidate = Reflect.get(globalThis, property);
    if (isStorage(storageCandidate)) {
      return;
    }
  }

  Object.defineProperty(globalThis, property, {
    configurable: true,
    writable: true,
    value: createMemoryStorage(),
  });
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
