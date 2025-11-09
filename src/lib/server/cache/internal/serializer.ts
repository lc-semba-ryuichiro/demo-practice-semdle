const lexicalStringCompare = (a: string, b: string) => {
  if (a === b) {
    return 0;
  }

  return a < b ? -1 : 1;
};

export function defaultArgsToKey(...args: unknown[]): string {
  return serializeCacheValue(args, '$', new WeakMap<object, string>());
}

function serializeCacheValue(value: unknown, path: string, seen: WeakMap<object, string>): string {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string') {
    return `string:${JSON.stringify(value)}`;
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      return 'number:NaN';
    }

    if (!Number.isFinite(value)) {
      return `number:${value > 0 ? 'Infinity' : '-Infinity'}`;
    }

    if (Object.is(value, -0)) {
      return 'number:-0';
    }

    return `number:${value.toString()}`;
  }

  if (typeof value === 'bigint') {
    return `bigint:${value.toString()}`;
  }

  if (typeof value === 'boolean') {
    return `boolean:${value ? 'true' : 'false'}`;
  }

  if (typeof value === 'undefined') {
    return 'undefined';
  }

  if (typeof value === 'symbol' || typeof value === 'function') {
    throw new TypeError(`Cannot serialize ${typeof value} at ${path}. Provide a custom argsToKey.`);
  }

  if (value instanceof Date) {
    return `date:${value.toISOString()}`;
  }

  if (value instanceof RegExp) {
    return `regexp:${value.flags}:${value.source}`;
  }

  if (Array.isArray(value)) {
    const reference = trackReference(value, path, seen);
    if (reference !== undefined) {
      return reference;
    }

    const entries = value.map((entry, index) =>
      serializeCacheValue(entry, `${path}[${index}]`, seen),
    );
    return `array:[${entries.join(',')}]`;
  }

  if (value instanceof Set) {
    const reference = trackReference(value, path, seen);
    if (reference !== undefined) {
      return reference;
    }

    const serialized = Array.from(value)
      .map((item, index) => serializeCacheValue(item, `${path}.set[${index}]`, seen))
      .sort(lexicalStringCompare);
    return `set:{${serialized.join(',')}}`;
  }

  if (value instanceof Map) {
    const reference = trackReference(value, path, seen);
    if (reference !== undefined) {
      return reference;
    }

    const serializedEntries = Array.from(value.entries())
      .map(([key, entryValue], index) => {
        const serializedKey = serializeCacheValue(key, `${path}.map[${index}].key`, seen);
        const serializedValue = serializeCacheValue(
          entryValue,
          `${path}.map[${index}].value`,
          seen,
        );
        return `${serializedKey}=>${serializedValue}`;
      })
      .sort(lexicalStringCompare);

    return `map:{${serializedEntries.join(',')}}`;
  }

  if (ArrayBuffer.isView(value)) {
    return serializeTypedArray(value, path, seen);
  }

  if (value instanceof ArrayBuffer) {
    const reference = trackReference(value, path, seen);
    if (reference !== undefined) {
      return reference;
    }

    const bytes = Array.from(new Uint8Array(value));
    return `ArrayBuffer:[${bytes.join(',')}]`;
  }

  if (value instanceof Promise) {
    throw new TypeError(`Cannot serialize Promise at ${path}. Provide a custom argsToKey.`);
  }

  if (value instanceof WeakMap || value instanceof WeakSet) {
    throw new TypeError(
      `Cannot serialize weak collections at ${path}. Provide a custom argsToKey.`,
    );
  }

  if (isRecord(value)) {
    const reference = trackReference(value, path, seen);
    if (reference !== undefined) {
      return reference;
    }

    const propertyEntries = Object.keys(value)
      .sort(lexicalStringCompare)
      .map((key) => {
        const serializedValue = serializeCacheValue(value[key], `${path}.${key}`, seen);
        return `${JSON.stringify(key)}:${serializedValue}`;
      });

    const symbolEntries = Object.getOwnPropertySymbols(value)
      .sort((a, b) => lexicalStringCompare(a.toString(), b.toString()))
      .map((symbolKey) => {
        const label = symbolKey.toString();
        const serializedValue = serializeCacheValue(value[symbolKey], `${path}.${label}`, seen);
        return `${label}:${serializedValue}`;
      });

    const entries = [...propertyEntries, ...symbolEntries];
    return `${getPrototypeLabel(value)}{${entries.join(',')}}`;
  }

  return `unknown:${Object.prototype.toString.call(value)}`;
}

function trackReference(value: object, path: string, seen: WeakMap<object, string>) {
  const existingPath = seen.get(value);
  if (existingPath !== undefined) {
    return `ref:${existingPath}`;
  }

  seen.set(value, path);
  return undefined;
}

function serializeTypedArray(view: ArrayBufferView, path: string, seen: WeakMap<object, string>) {
  const reference = trackReference(view, path, seen);
  if (reference !== undefined) {
    return reference;
  }

  const constructorNameRaw = view.constructor.name;
  const constructorName = constructorNameRaw.length > 0 ? constructorNameRaw : 'TypedArray';
  const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  return `${constructorName}:[${Array.from(bytes).join(',')}]`;
}

function getPrototypeLabel(value: object) {
  const proto = Reflect.getPrototypeOf(value);
  if (proto === null) {
    return 'object:null-proto';
  }

  if (!hasConstructor(proto)) {
    return 'object';
  }

  const ctorName = proto.constructor?.name;
  if (typeof ctorName === 'string' && ctorName.length > 0) {
    return ctorName;
  }

  return 'object';
}

type PrototypeWithConstructor = {
  constructor?: { name?: string };
};

function hasConstructor(value: object): value is PrototypeWithConstructor {
  return 'constructor' in value;
}

function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null;
}
