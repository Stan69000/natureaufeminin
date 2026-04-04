import mediaMap from "./wp-media-map.json";
import { toHTML } from "@portabletext/to-html";

export interface SitePageContent {
  slug: string;
  title: string;
  html: string;
  pricingSections?: PricingSection[];
  pricingIntro?: string;
  pricingCtaText?: string;
  pricingCtaLabel?: string;
  pricingCtaUrl?: string;
  prestationsMenuTitle?: string;
  prestationsIntro?: string;
  prestationsMenu?: PrestationsMenuItem[];
  actualitesIntro?: string;
  actualitesItems?: ActualiteItem[];
  circleIntro?: string;
  circlePartners?: CirclePartnerItem[];
  seoTitle?: string;
  seoDescription?: string;
  source: "sanity";
}

interface PricingItem {
  label?: string;
  price?: string;
}

interface PricingSection {
  title?: string;
  items?: PricingItem[];
}

interface PrestationsMenuItem {
  label?: string;
  href?: string;
  description?: string;
}

interface ActualiteItem {
  title?: string;
  publishedAt?: string;
  excerpt?: string;
  youtubeUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

interface CirclePartnerItem {
  name?: string;
  role?: string;
  websiteUrl?: string;
}

interface SanityPage {
  slug: string;
  title: string;
  body?: unknown[];
  bodyHtml: string;
  pricingSections?: PricingSection[];
  pricingIntro?: string;
  pricingCtaText?: string;
  pricingCtaLabel?: string;
  pricingCtaUrl?: string;
  prestationsMenuTitle?: string;
  prestationsIntro?: string;
  prestationsMenu?: PrestationsMenuItem[];
  actualitesIntro?: string;
  actualitesItems?: ActualiteItem[];
  circleIntro?: string;
  circlePartners?: CirclePartnerItem[];
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

function hasMediaTags(html: string): boolean {
  return /<(img|iframe|video)\b/i.test(html);
}

function pickBestHtmlContent(page: SanityPage): string {
  const portableHtml =
    Array.isArray(page.body) && page.body.length > 0 ? toHTML(page.body as any[]) : "";
  const legacyHtml = page.bodyHtml ?? "";

  if (!portableHtml.trim()) {
    return legacyHtml;
  }

  // Keep legacy HTML when it still contains media and portable text does not.
  if (legacyHtml.trim() && hasMediaTags(legacyHtml) && !hasMediaTags(portableHtml)) {
    return legacyHtml;
  }

  return portableHtml;
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
    pricingSections[]{
      title,
      items[]{
        label,
        price
      }
    },
    pricingIntro,
    pricingCtaText,
    pricingCtaLabel,
    pricingCtaUrl,
    prestationsMenuTitle,
    prestationsIntro,
    prestationsMenu[]{
      label,
      href,
      description
    },
    actualitesIntro,
    actualitesItems[]{
      title,
      publishedAt,
      excerpt,
      youtubeUrl,
      ctaLabel,
      ctaUrl
    },
    circleIntro,
    circlePartners[]{
      name,
      role,
      websiteUrl
    },
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
    html: normalizeHtml(pickBestHtmlContent(sanityPage)),
    pricingSections: sanityPage.pricingSections?.map((section) => ({
      title: section.title ? decodeEntities(section.title) : undefined,
      items: section.items?.map((item) => ({
        label: item.label ? decodeEntities(item.label) : undefined,
        price: item.price ? decodeEntities(item.price) : undefined,
      })),
    })),
    pricingIntro: sanityPage.pricingIntro
      ? decodeEntities(sanityPage.pricingIntro)
      : undefined,
    pricingCtaText: sanityPage.pricingCtaText
      ? decodeEntities(sanityPage.pricingCtaText)
      : undefined,
    pricingCtaLabel: sanityPage.pricingCtaLabel
      ? decodeEntities(sanityPage.pricingCtaLabel)
      : undefined,
    pricingCtaUrl: sanityPage.pricingCtaUrl ? decodeEntities(sanityPage.pricingCtaUrl) : undefined,
    prestationsMenuTitle: sanityPage.prestationsMenuTitle
      ? decodeEntities(sanityPage.prestationsMenuTitle)
      : undefined,
    prestationsIntro: sanityPage.prestationsIntro
      ? decodeEntities(sanityPage.prestationsIntro)
      : undefined,
    prestationsMenu: sanityPage.prestationsMenu?.map((item) => ({
      label: item.label ? decodeEntities(item.label) : undefined,
      href: item.href ? decodeEntities(item.href) : undefined,
      description: item.description ? decodeEntities(item.description) : undefined,
    })),
    actualitesIntro: sanityPage.actualitesIntro
      ? decodeEntities(sanityPage.actualitesIntro)
      : undefined,
    actualitesItems: sanityPage.actualitesItems?.map((item) => ({
      title: item.title ? decodeEntities(item.title) : undefined,
      publishedAt: item.publishedAt,
      excerpt: item.excerpt ? decodeEntities(item.excerpt) : undefined,
      youtubeUrl: item.youtubeUrl ? decodeEntities(item.youtubeUrl) : undefined,
      ctaLabel: item.ctaLabel ? decodeEntities(item.ctaLabel) : undefined,
      ctaUrl: item.ctaUrl ? decodeEntities(item.ctaUrl) : undefined,
    })),
    circleIntro: sanityPage.circleIntro ? decodeEntities(sanityPage.circleIntro) : undefined,
    circlePartners: sanityPage.circlePartners?.map((item) => ({
      name: item.name ? decodeEntities(item.name) : undefined,
      role: item.role ? decodeEntities(item.role) : undefined,
      websiteUrl: item.websiteUrl ? decodeEntities(item.websiteUrl) : undefined,
    })),
    seoTitle: sanityPage.seoTitle ? decodeEntities(sanityPage.seoTitle) : undefined,
    seoDescription: sanityPage.seoDescription
      ? decodeEntities(sanityPage.seoDescription)
      : undefined,
    source: "sanity",
  };
}
