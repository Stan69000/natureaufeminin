import mediaMap from "./wp-media-map.json";
import { toHTML } from "@portabletext/to-html";

export interface SitePageContent {
  slug: string;
  title: string;
  html: string;
  seoTitle?: string;
  seoDescription?: string;
  source: "sanity";
}

interface SanityPage {
  slug: string;
  title: string;
  body?: unknown[];
  bodyHtml: string;
  seoTitle?: string;
  seoDescription?: string;
}

const linkMap = new Map<string, string>([
  ["https://naturaufeminin.fr/?page_id=16", "/contact"],
  ["https://naturaufeminin.fr/?page_id=20", "/prestations/naturopathie"],
  ["https://naturaufeminin.fr/?page_id=22", "/tarifs"],
  ["https://naturaufeminin.fr/?page_id=25", "/actualites"],
  ["https://naturaufeminin.fr/?page_id=27", "/prestations"],
  ["https://naturaufeminin.fr/?page_id=30", "/mon-cercle"],
  ["https://naturaufeminin.fr/?page_id=32", "/mentions-legales"],
  ["https://naturaufeminin.fr/?page_id=34", "/prestations/ecoute-corporelle"],
  ["https://naturaufeminin.fr/?page_id=36", "/prestations/symptothermie"],
  ["https://naturaufeminin.fr/?page_id=38", "/prestations/doula"],
  ["https://naturaufeminin.fr/contact/", "/contact"],
]);

function decodeEntities(input: string): string {
  return input
    .replaceAll("&#038;", "&")
    .replaceAll("&rsquo;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&ndash;", "-")
    .replaceAll("&mdash;", "-");
}

function normalizeHtml(html: string): string {
  let result = html;
  for (const [from, to] of linkMap.entries()) {
    result = result.split(from).join(to);
  }
  for (const [from, to] of Object.entries(mediaMap as Record<string, string>)) {
    result = result.split(from).join(to);
  }
  return result;
}

function getSanityConfig() {
  const projectId = import.meta.env.SANITY_PROJECT_ID;
  const dataset = import.meta.env.SANITY_DATASET;
  const apiVersion = import.meta.env.SANITY_API_VERSION || "2025-01-01";

  if (!projectId || !dataset) return null;
  return { projectId, dataset, apiVersion };
}

async function getSanityPage(slug: string): Promise<SanityPage | null> {
  const sanity = getSanityConfig();
  if (!sanity) return null;

  const query = `*[_type == "page" && slug.current == $slug][0]{
    "slug": slug.current,
    title,
    body,
    bodyHtml,
    seoTitle,
    seoDescription
  }`;

  const url = new URL(
    `https://${sanity.projectId}.api.sanity.io/v${sanity.apiVersion}/data/query/${sanity.dataset}`,
  );
  url.searchParams.set("query", query);
  url.searchParams.set("$slug", JSON.stringify(slug));

  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.status}`);
  }

  const payload = await response.json();
  return (payload?.result as SanityPage | null) ?? null;
}

export async function getPageContent(slug: string): Promise<SitePageContent> {
  const sanityPage = await getSanityPage(slug);
  if (!sanityPage?.title) {
    throw new Error(`Missing Sanity page for slug "${slug}"`);
  }

  return {
    slug,
    title: decodeEntities(sanityPage.title),
    html: normalizeHtml(
      Array.isArray(sanityPage.body) && sanityPage.body.length > 0
        ? toHTML(sanityPage.body as any[])
        : sanityPage.bodyHtml ?? "",
    ),
    seoTitle: sanityPage.seoTitle ? decodeEntities(sanityPage.seoTitle) : undefined,
    seoDescription: sanityPage.seoDescription
      ? decodeEntities(sanityPage.seoDescription)
      : undefined,
    source: "sanity",
  };
}
