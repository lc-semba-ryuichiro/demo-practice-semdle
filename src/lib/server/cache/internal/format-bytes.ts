export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes.toFixed(0)}B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'] as const;
  const exponent = Math.max(1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const unitIndex = Math.min(units.length - 1, exponent - 1);
  const value = bytes / 1024 ** (unitIndex + 1);
  const unit = units[unitIndex] ?? 'KB';
  return `${value.toFixed(1)}${unit}`;
}
