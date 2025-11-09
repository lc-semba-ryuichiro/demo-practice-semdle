import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.client.NEXT_PUBLIC_SITE_URL;
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    {
      url: `${base}${ROUTES.app.root}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}${ROUTES.app.dashboard}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];
}
