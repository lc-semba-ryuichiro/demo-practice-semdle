import { envClient } from '@/config/env.client';

export type FetcherOptions<T> = RequestInit & {
  parse: (payload: unknown) => T;
};

export async function fetcher<T>(input: RequestInfo | URL, options: FetcherOptions<T>): Promise<T> {
  const { parse, headers: initHeaders, ...init } = options;

  const headers = new Headers(initHeaders);
  headers.set('x-app-origin', envClient.NEXT_PUBLIC_SITE_URL);

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const payload: unknown = await response.json();
  return parse(payload);
}
