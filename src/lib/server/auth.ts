import { env } from '@/config/env';
import { cookies } from 'next/headers';

export async function handlePkceCallback(callbackUrl: string) {
  const cookieStore = await cookies();
  cookieStore.set('sb-access-token', 'demo-token', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return {
    status: 200,
    body: {
      redirected: callbackUrl,
      siteUrl: env.client.NEXT_PUBLIC_SITE_URL,
    },
  };
}
