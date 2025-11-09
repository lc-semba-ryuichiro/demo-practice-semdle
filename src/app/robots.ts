import { env } from '@/config/env';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    host: env.client.NEXT_PUBLIC_SITE_URL,
    sitemap: [`${env.client.NEXT_PUBLIC_SITE_URL}/sitemap.xml`],
    rules: {
      userAgent: '*',
      allow: '/',
    },
  };
}
