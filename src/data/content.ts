import { getWpPage, getWpTitle, normalizeWpHtml } from "./wp";

export interface SitePageContent {
  slug: string;
  title: string;
  html: string;
  seoTitle?: string;
  seoDescription?: string;
  source: "sanity" | "wp-local";
}

interface SanityPage {
  slug: string;
  title: string;
  bodyHtml: string;
  seoTitle?: string;
  seoDescription?: string;
}

function getLocalFallback(slug: string): SitePageContent {
  const page = getWpPage(slug);
  return {
    slug,
    title: getWpTitle(slug) || slug,
    html: normalizeWpHtml(page?.content.rendered ?? ""),
    source: "wp-local",
  };
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
  try {
    const sanityPage = await getSanityPage(slug);
    if (sanityPage?.title) {
      return {
        slug,
        title: sanityPage.title,
        html: normalizeWpHtml(sanityPage.bodyHtml ?? ""),
        seoTitle: sanityPage.seoTitle,
        seoDescription: sanityPage.seoDescription,
        source: "sanity",
      };
    }
  } catch (error) {
    console.warn(`[content] fallback to wp-local for "${slug}"`, error);
  }

  return getLocalFallback(slug);
}
