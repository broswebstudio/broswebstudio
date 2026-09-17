import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard/', '/login/', '/profile/'],
    },
    sitemap: 'https://www.broswebstudio.in/sitemap.xml',
  };
}
