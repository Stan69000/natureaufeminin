import type { APIRoute } from 'astro';
import { siteConfig } from '../data/site';

const routes = [
  '/',
  '/qui-suis-je',
  '/prestations',
  '/prestations/naturopathie',
  '/prestations/ecoute-corporelle',
  '/prestations/symptothermie',
  '/prestations/doula',
  '/tarifs',
  '/actualites',
  '/mon-cercle',
  '/contact',
  '/mentions-legales',
  '/politique-de-confidentialite',
];

export const GET: APIRoute = () => {
  const urls = routes
    .map((path) => `<url><loc>${siteConfig.url}${path}</loc></url>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
