import { envServer } from '@/config/env.server';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = new URL(envServer.SITE_URL).origin;

  return {
    host: siteOrigin,
    sitemap: [`${siteOrigin}/sitemap.xml`],
    rules: {
      userAgent: '*',
      allow: '/',
    },
  };
}
