import { envClient } from '@/config/env.client';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    host: envClient.NEXT_PUBLIC_SITE_URL,
    sitemap: [`${envClient.NEXT_PUBLIC_SITE_URL}/sitemap.xml`],
    rules: {
      userAgent: '*',
      allow: '/',
    },
  };
}
