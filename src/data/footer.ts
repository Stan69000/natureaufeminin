import { siteConfig } from "./site";
import { sanitizeCmsUrl } from "../utils/security";

interface FooterLinkItem {
  label?: string;
  href?: string;
}

interface AdminFooterSettings {
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
    .replaceAll("&rsquo;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&ndash;", "-")
    .replaceAll("&mdash;", "-")
    .replaceAll("&#038;", "&");
}

async function getAdminFooterSettings(): Promise<AdminFooterSettings | null> {
  const base = import.meta.env.NAF_ADMIN_API_URL;
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/public/naf/footer`, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as AdminFooterSettings;
  } catch {
    return null;
  }
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
    { label: "Naturopathe Ouest lyonnais", href: "/ouest-lyonnais" },
    { label: "Zones desservies", href: "/zones-desservies" },
    { label: "Mentions legales", href: "/mentions-legales" },
    { label: "Politique de confidentialite", href: "/politique-de-confidentialite" },
    { label: "Plan du site (XML)", href: "/sitemap.xml" },
    { label: "Admin", href: siteConfig.adminUrl },
  ],
};

export async function getFooterContent(): Promise<FooterContent> {
  const footerSettings = await getAdminFooterSettings();

  if (!footerSettings) return defaultFooterContent;

  const brandPoints =
    footerSettings.brandPoints
      ?.map((item) => item?.trim())
      .filter((item): item is string => Boolean(item))
      .map((item) => decodeEntities(item)) ?? defaultFooterContent.brandPoints;

  const contactItems =
    footerSettings.contactItems
      ?.map((item) => sanitizeLinkItem(item, { requireHref: false }))
      .filter((item): item is { label: string; href?: string } => Boolean(item)) ??
    defaultFooterContent.contactItems;

  const accompagnements =
    footerSettings.accompagnements
      ?.map((item) => sanitizeLinkItem(item, { requireHref: true }))
      .filter((item): item is { label: string; href: string } => Boolean(item?.href)) ??
    defaultFooterContent.accompagnements;

  const informations =
    footerSettings.informations
      ?.map((item) => sanitizeLinkItem(item, { requireHref: true }))
      .filter((item): item is { label: string; href: string } => Boolean(item?.href)) ??
    defaultFooterContent.informations;

  const specialites =
    footerSettings.specialites
      ?.map((item) => item?.trim())
      .filter((item): item is string => Boolean(item))
      .map((item) => decodeEntities(item)) ?? defaultFooterContent.specialites;

  const accompagnementsAllHref =
    sanitizeCmsUrl(footerSettings.accompagnementsAllHref, {
      allowRelative: true,
      allowedProtocols: ["https:"],
    }) ?? defaultFooterContent.accompagnementsAllHref;

  return {
    brandName: defaultFooterContent.brandName,
    brandPoints: brandPoints.length > 0 ? brandPoints : defaultFooterContent.brandPoints,
    contactTitle: footerSettings.contactTitle?.trim()
      ? decodeEntities(footerSettings.contactTitle.trim())
      : defaultFooterContent.contactTitle,
    contactItems: contactItems.length > 0 ? contactItems : defaultFooterContent.contactItems,
    accompagnementsTitle: footerSettings.accompagnementsTitle?.trim()
      ? decodeEntities(footerSettings.accompagnementsTitle.trim())
      : defaultFooterContent.accompagnementsTitle,
    accompagnements: accompagnements.length > 0 ? accompagnements : defaultFooterContent.accompagnements,
    accompagnementsAllLabel: footerSettings.accompagnementsAllLabel?.trim()
      ? decodeEntities(footerSettings.accompagnementsAllLabel.trim())
      : defaultFooterContent.accompagnementsAllLabel,
    accompagnementsAllHref,
    specialitesTitle: footerSettings.specialitesTitle?.trim()
      ? decodeEntities(footerSettings.specialitesTitle.trim())
      : defaultFooterContent.specialitesTitle,
    specialites: specialites.length > 0 ? specialites : defaultFooterContent.specialites,
    informationsTitle: footerSettings.informationsTitle?.trim()
      ? decodeEntities(footerSettings.informationsTitle.trim())
      : defaultFooterContent.informationsTitle,
    informations: informations.length > 0 ? informations : defaultFooterContent.informations,
  };
}
