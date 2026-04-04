import pages from './wp-pages.json';

interface WpPage {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
}

const map = new Map<string, string>([
  ['https://naturaufeminin.fr/?page_id=16', '/contact'],
  ['https://naturaufeminin.fr/?page_id=20', '/prestations/naturopathie'],
  ['https://naturaufeminin.fr/?page_id=22', '/tarifs'],
  ['https://naturaufeminin.fr/?page_id=25', '/actualites'],
  ['https://naturaufeminin.fr/?page_id=27', '/prestations'],
  ['https://naturaufeminin.fr/?page_id=30', '/mon-cercle'],
  ['https://naturaufeminin.fr/?page_id=32', '/mentions-legales'],
  ['https://naturaufeminin.fr/?page_id=34', '/prestations/ecoute-corporelle'],
  ['https://naturaufeminin.fr/?page_id=36', '/prestations/symptothermie'],
  ['https://naturaufeminin.fr/?page_id=38', '/prestations/doula'],
  ['https://naturaufeminin.fr/contact/', '/contact'],
]);

function decodeEntities(input: string): string {
  return input
    .replaceAll('&#038;', '&')
    .replaceAll('&rsquo;', "'")
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&ndash;', '-')
    .replaceAll('&mdash;', '-');
}

export function getWpPage(slug: string): WpPage | undefined {
  return (pages as WpPage[]).find((page) => page.slug === slug);
}

export function normalizeWpHtml(html: string): string {
  let result = html;
  for (const [from, to] of map.entries()) {
    result = result.split(from).join(to);
  }
  return result;
}

export function getWpTitle(slug: string): string {
  const page = getWpPage(slug);
  return decodeEntities(page?.title.rendered ?? '');
}
