import { siteConfig } from "./site";
import { sanitizeCmsUrl } from "../utils/security";

interface FooterLinkItem {
  label?: string;
  href?: string;
}

interface SanityFooterSettings {
  brandPoints?: string[];
  contactTitle?: string;
  contactItems?: FooterLinkItem[];
  accompagnementsTitle?: string;
  accompagnements?: FooterLinkItem[];
  accompagnementsAllLabel?: string;
  accompagnementsAllHref?: string;
  specialitesTitle?: string;
  specialites?: string[];
  informationsTitle?: string;
  informations?: FooterLinkItem[];
}

export interface FooterContent {
  brandName: string;
  brandPoints: string[];
  contactTitle: string;
  contactItems: Array<{ label: string; href?: string }>;
  accompagnementsTitle: string;
  accompagnements: Array<{ label: string; href: string }>;
  accompagnementsAllLabel: string;
  accompagnementsAllHref: string;
  specialitesTitle: string;
  specialites: string[];
  informationsTitle: string;
  informations: Array<{ label: string; href: string }>;
}

function decodeEntities(input: string): string {
  return input
    .replaceAll("&#038;", "&")
    .replaceAll("&rsquo;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&ndash;", "-")
    .replaceAll("&mdash;", "-");
}

function getSanityConfig() {
  const projectId = import.meta.env.SANITY_PROJECT_ID;
  const dataset = import.meta.env.SANITY_DATASET;
  const apiVersion = import.meta.env.SANITY_API_VERSION || "2025-01-01";

  if (!projectId || !dataset) return null;
  return { projectId, dataset, apiVersion };
}

async function getSanityFooterSettings(): Promise<SanityFooterSettings | null> {
  const sanity = getSanityConfig();
  if (!sanity) return null;

  const query = `*[_type == "footerSettings" && _id == "footerSettings"][0]{
    brandPoints,
    contactTitle,
    contactItems[]{
      label,
      href
    },
    accompagnementsTitle,
    accompagnements[]{
      label,
      href
    },
    accompagnementsAllLabel,
    accompagnementsAllHref,
    specialitesTitle,
    specialites,
    informationsTitle,
    informations[]{
      label,
      href
    }
  }`;

  const url = new URL(
    `https://${sanity.projectId}.api.sanity.io/v${sanity.apiVersion}/data/query/${sanity.dataset}`,
  );
  url.searchParams.set("query", query);

  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Sanity footer query failed: ${response.status}`);
  }

  const payload = await response.json();
  return (payload?.result as SanityFooterSettings | null) ?? null;
}

function sanitizeLinkItem(
  item: FooterLinkItem | undefined,
  options: { requireHref: boolean },
): { label: string; href?: string } | null {
  const rawLabel = item?.label?.trim();
  if (!rawLabel) return null;
  const label = decodeEntities(rawLabel);

  const href = sanitizeCmsUrl(item?.href, {
    allowRelative: true,
    allowedProtocols: ["https:", "mailto:", "tel:"],
  });

  if (options.requireHref && !href) return null;
  return href ? { label, href } : { label };
}

const defaultFooterContent: FooterContent = {
  brandName: siteConfig.name,
  brandPoints: ["Naturopathie", "Symptothermie", "Doula", "Régulation émotionnelle"],
  contactTitle: "Contact",
  contactItems: [
    { label: siteConfig.phone, href: siteConfig.phoneHref },
    { label: siteConfig.city },
    { label: "Prendre rendez-vous", href: "/contact" },
  ],
  accompagnementsTitle: "Accompagnements",
  accompagnements: [
    { label: "Naturopathie feminine", href: "/prestations/naturopathie" },
    { label: "Symptothermie", href: "/prestations/symptothermie" },
    { label: "Doula", href: "/prestations/doula" },
    { label: "Ecoute corporelle", href: "/prestations/ecoute-corporelle" },
  ],
  accompagnementsAllLabel: "Voir toutes les prestations",
  accompagnementsAllHref: "/prestations",
  specialitesTitle: "Spécialités",
  specialites: [
    "Gestion du stress",
    "Equilibre emotionnel",
    "Cycle feminin",
    "Syndrome premenstruel",
    "Puberte",
    "Menopause",
    "Accompagnement prenatal",
    "Allaitement",
    "Massage femme enceinte",
    "Massage bebe",
  ],
  informationsTitle: "Informations",
  informations: [
    { label: "Mentions legales", href: "/mentions-legales" },
    { label: "Politique de confidentialite", href: "/politique-de-confidentialite" },
    { label: "Plan du site (XML)", href: "/sitemap.xml" },
    { label: "Admin", href: siteConfig.adminUrl },
  ],
};

export async function getFooterContent(): Promise<FooterContent> {
  let sanityFooter: SanityFooterSettings | null = null;
  try {
    sanityFooter = await getSanityFooterSettings();
  } catch {
    return defaultFooterContent;
  }

  if (!sanityFooter) return defaultFooterContent;

  const brandPoints =
    sanityFooter.brandPoints
      ?.map((item) => item?.trim())
      .filter((item): item is string => Boolean(item))
      .map((item) => decodeEntities(item)) ?? defaultFooterContent.brandPoints;

  const contactItems =
    sanityFooter.contactItems
      ?.map((item) => sanitizeLinkItem(item, { requireHref: false }))
      .filter((item): item is { label: string; href?: string } => Boolean(item)) ??
    defaultFooterContent.contactItems;

  const accompagnements =
    sanityFooter.accompagnements
      ?.map((item) => sanitizeLinkItem(item, { requireHref: true }))
      .filter((item): item is { label: string; href: string } => Boolean(item?.href)) ??
    defaultFooterContent.accompagnements;

  const informations =
    sanityFooter.informations
      ?.map((item) => sanitizeLinkItem(item, { requireHref: true }))
      .filter((item): item is { label: string; href: string } => Boolean(item?.href)) ??
    defaultFooterContent.informations;

  const specialites =
    sanityFooter.specialites
      ?.map((item) => item?.trim())
      .filter((item): item is string => Boolean(item))
      .map((item) => decodeEntities(item)) ?? defaultFooterContent.specialites;

  const accompagnementsAllHref =
    sanitizeCmsUrl(sanityFooter.accompagnementsAllHref, {
      allowRelative: true,
      allowedProtocols: ["https:"],
    }) ?? defaultFooterContent.accompagnementsAllHref;

  return {
    brandName: defaultFooterContent.brandName,
    brandPoints: brandPoints.length > 0 ? brandPoints : defaultFooterContent.brandPoints,
    contactTitle: sanityFooter.contactTitle?.trim()
      ? decodeEntities(sanityFooter.contactTitle.trim())
      : defaultFooterContent.contactTitle,
    contactItems: contactItems.length > 0 ? contactItems : defaultFooterContent.contactItems,
    accompagnementsTitle: sanityFooter.accompagnementsTitle?.trim()
      ? decodeEntities(sanityFooter.accompagnementsTitle.trim())
      : defaultFooterContent.accompagnementsTitle,
    accompagnements: accompagnements.length > 0 ? accompagnements : defaultFooterContent.accompagnements,
    accompagnementsAllLabel: sanityFooter.accompagnementsAllLabel?.trim()
      ? decodeEntities(sanityFooter.accompagnementsAllLabel.trim())
      : defaultFooterContent.accompagnementsAllLabel,
    accompagnementsAllHref,
    specialitesTitle: sanityFooter.specialitesTitle?.trim()
      ? decodeEntities(sanityFooter.specialitesTitle.trim())
      : defaultFooterContent.specialitesTitle,
    specialites: specialites.length > 0 ? specialites : defaultFooterContent.specialites,
    informationsTitle: sanityFooter.informationsTitle?.trim()
      ? decodeEntities(sanityFooter.informationsTitle.trim())
      : defaultFooterContent.informationsTitle,
    informations: informations.length > 0 ? informations : defaultFooterContent.informations,
  };
}

