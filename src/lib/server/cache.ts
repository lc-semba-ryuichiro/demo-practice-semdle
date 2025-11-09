const registry = new Map<string, unknown>();

export function cacheGet(key: string): unknown;
export function cacheGet<T>(key: string, validate: (value: unknown) => value is T): T | undefined;
export function cacheGet<T>(key: string, validate?: (value: unknown) => value is T) {
  if (!registry.has(key)) {
    return undefined;
  }

  const value = registry.get(key);

  if (validate === undefined) {
    return value;
  }

  if (!validate(value)) {
    return undefined;
  }

  return value;
}

export function cacheSet<T>(key: string, value: T): T {
  registry.set(key, value);
  return value;
}

export function cacheClear(prefix?: string) {
  if (prefix === undefined) {
    registry.clear();
    return;
  }

  [...registry.keys()].forEach((key) => {
    if (key.startsWith(prefix)) {
      registry.delete(key);
    }
  });
}
