export type BrandedId<T extends string> = string & Readonly<{ __brand: T }>;
