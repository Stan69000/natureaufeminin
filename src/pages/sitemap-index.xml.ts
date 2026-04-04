import type { APIRoute } from 'astro';
import { siteConfig } from '../data/site';

const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/qui-suis-je', priority: '0.8', changefreq: 'monthly' },
  { path: '/prestations', priority: '0.9', changefreq: 'monthly' },
  { path: '/prestations/naturopathie', priority: '0.8', changefreq: 'monthly' },
  { path: '/prestations/ecoute-corporelle', priority: '0.8', changefreq: 'monthly' },
  { path: '/prestations/symptothermie', priority: '0.8', changefreq: 'monthly' },
  { path: '/prestations/doula', priority: '0.8', changefreq: 'monthly' },
  { path: '/tarifs', priority: '0.8', changefreq: 'monthly' },
  { path: '/actualites', priority: '0.7', changefreq: 'weekly' },
  { path: '/mon-cercle', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.9', changefreq: 'monthly' },
  { path: '/mentions-legales', priority: '0.2', changefreq: 'yearly' },
  { path: '/politique-de-confidentialite', priority: '0.2', changefreq: 'yearly' },
] as const;

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString();
  const urls = routes
    .map(
      (route) =>
        `<url><loc>${siteConfig.url}${route.path}</loc><lastmod>${lastmod}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
