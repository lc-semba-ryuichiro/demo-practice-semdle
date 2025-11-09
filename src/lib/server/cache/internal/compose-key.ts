import { KEY_SEPARATOR } from './constants';

export function composeKey(parts: Array<string | number | boolean>) {
  return parts.map((part) => String(part)).join(KEY_SEPARATOR);
}
