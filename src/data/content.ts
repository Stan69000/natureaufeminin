import sanitizeHtml from "sanitize-html";

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
  source: "admin";
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

function normalizeHtml(html: string): string {
  let result = html;
  for (const [from, to] of linkMap.entries()) {
    result = result.split(from).join(to);
  }
  return optimizeHtmlForSeo(sanitizeCmsHtml(result));
}

function sanitizeCmsHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "blockquote",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "a",
      "img",
      "figure",
      "figcaption",
      "iframe",
      "div",
      "span",
    ],
    allowedAttributes: {
      "*": ["class", "id"],
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
      iframe: [
        "src",
        "title",
        "width",
        "height",
        "allow",
        "allowfullscreen",
        "loading",
        "referrerpolicy",
      ],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    allowProtocolRelative: false,
    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "www.youtube-nocookie.com",
      "youtube-nocookie.com",
    ],
  });
}

// Les images du CMS sont servies par le CDN Sanity, qui expose une API de
// transformation : ?w= redimensionne, auto=format sert du WebP/AVIF aux
// navigateurs compatibles. Sans ca, la photo de /qui-suis-je partait en
// 2305x2560 pour 771 Ko, affichee a moins de 800 px de large.
// Le nom de fichier Sanity se termine par -<largeur>x<hauteur>.<ext>, ce qui
// donne les dimensions intrinseques sans requete reseau : on peut donc poser
// width/height et supprimer le decalage de mise en page au chargement.
const SANITY_WIDTHS = [480, 768, 1200, 1600];
const SANITY_MAX_WIDTH = SANITY_WIDTHS[SANITY_WIDTHS.length - 1];

interface SanityImageVariants {
  src: string;
  attrs: string;
}

function buildSanityImageVariants(src: string): SanityImageVariants | null {
  const dimensions = src.match(/-(\d+)x(\d+)\.[a-z]+$/i);
  if (!dimensions) return null;

  const naturalWidth = Number(dimensions[1]);
  const naturalHeight = Number(dimensions[2]);
  if (!naturalWidth || !naturalHeight) return null;

  const variant = (width: number) => `${src}?w=${width}&auto=format&q=75&fit=max`;

  // L'original n'entre jamais dans le srcset : un ecran haute densite le
  // choisirait et rechargerait le fichier complet (771 Ko pour la photo de
  // /qui-suis-je). Toutes les variantes passent par le CDN, donc en WebP.
  const widths = Array.from(
    new Set([
      ...SANITY_WIDTHS.filter((width) => width < naturalWidth),
      Math.min(naturalWidth, SANITY_MAX_WIDTH),
    ]),
  ).sort((a, b) => a - b);

  const displayWidth = widths[widths.length - 1];
  const displayHeight = Math.round((displayWidth * naturalHeight) / naturalWidth);
  const srcset = widths.map((width) => `${variant(width)} ${width}w`).join(", ");

  return {
    src: variant(displayWidth),
    attrs:
      ` width="${displayWidth}" height="${displayHeight}"` +
      ` srcset="${srcset}" sizes="(min-width: 768px) 720px, 100vw"`,
  };
}

function optimizeHtmlForSeo(html: string): string {
  let result = html;

  // Avoid duplicate H1 (the page template already includes the main H1).
  result = result
    .replace(/<h1(\s[^>]*)?>/gi, (_match, attrs = "") => `<h2${attrs}>`)
    .replace(/<\/h1>/gi, "</h2>");

  // Ensure external links opened in new tabs always include noopener/noreferrer.
  result = result.replace(/<a([^>]*target="_blank"[^>]*)>/gi, (_match, attrs: string) => {
    if (/rel\s*=/.test(attrs)) {
      return `<a${attrs.replace(/rel\s*=\s*["']([^"']*)["']/i, (_relMatch, relValue: string) => {
        const relTokens = new Set(
          relValue
            .split(/\s+/)
            .map((token) => token.trim())
            .filter(Boolean),
        );
        relTokens.add("noopener");
        relTokens.add("noreferrer");
        return ` rel="${Array.from(relTokens).join(" ")}"`;
      })}>`;
    }
    return `<a${attrs} rel="noopener noreferrer">`;
  });

  // Improve image technical attributes and provide fallback alt text when missing.
  result = result.replace(/<img\b([^>]*)>/gi, (_match, attrs: string) => {
    let nextAttrs = attrs.replace(/\s*\/\s*$/, "").trimEnd();

    if (!/\bloading\s*=/.test(nextAttrs)) {
      nextAttrs += ' loading="lazy"';
    }
    if (!/\bdecoding\s*=/.test(nextAttrs)) {
      nextAttrs += ' decoding="async"';
    }

    const altAttrMatch = nextAttrs.match(/\balt\s*=\s*["']([^"']*)["']/i);
    if (!altAttrMatch) {
      nextAttrs += ' alt="Illustration Natur Au Feminin"';
    } else if (!altAttrMatch[1].trim()) {
      nextAttrs = nextAttrs.replace(/\balt\s*=\s*["'][^"']*["']/i, 'alt="Illustration Natur Au Feminin"');
    }

    const imageSrc = nextAttrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (imageSrc?.startsWith("https://cdn.sanity.io/") && !/\bsrcset\s*=/.test(nextAttrs)) {
      const variants = buildSanityImageVariants(imageSrc);
      if (variants) {
        // src pointe aussi sur une variante : meme sans support de srcset,
        // aucun navigateur ne telecharge l'original.
        nextAttrs = nextAttrs.replace(
          /\bsrc\s*=\s*["'][^"']+["']/i,
          `src="${variants.src}"`,
        );
        nextAttrs += variants.attrs;
      }
    }

    return `<img${nextAttrs} />`;
  });

  return result;
}

interface AdminPage {
  slug: string;
  title: string;
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

async function getAdminPage(slug: string): Promise<AdminPage> {
  const useCiFixtures =
    import.meta.env.CI === "true" && import.meta.env.NAF_USE_CONTENT_FIXTURES === "true";

  if (useCiFixtures) {
    return {
      slug,
      title: `CI fixture: ${slug}`,
      bodyHtml: "<p>Deterministic content fixture used to validate the static build.</p>",
    };
  }

  const base = import.meta.env.NAF_ADMIN_API_URL;
  if (!base) {
    throw new Error("Missing NAF_ADMIN_API_URL configuration.");
  }
  const url = `${base}/api/public/naf/pages/${slug}`;
  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { accept: "application/json" } });
      if (!res.ok) {
        const error = new Error(`HTTP ${res.status}`);
        if (![429, 502, 503, 504].includes(res.status)) throw error;
        lastError = error;
      } else {
        const data = (await res.json()) as AdminPage;
        if (!data?.title) {
          throw new Error("response does not contain a page title");
        }
        console.log(`[NAF] Admin page loaded: "${slug}" (source: admin)`);
        return data;
      }
    } catch (err) {
      lastError = err;
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  throw new Error(`[NAF] Admin fetch failed for "${slug}" at ${url}: ${String(lastError)}`);
}

export async function getPageContent(slug: string): Promise<SitePageContent> {
  const adminPage = await getAdminPage(slug);
  return {
    slug,
    title: adminPage.title,
    html: normalizeHtml(adminPage.bodyHtml ?? ""),
    pricingSections: adminPage.pricingSections,
    pricingIntro: adminPage.pricingIntro,
    pricingCtaText: adminPage.pricingCtaText,
    pricingCtaLabel: adminPage.pricingCtaLabel,
    pricingCtaUrl: adminPage.pricingCtaUrl,
    prestationsMenuTitle: adminPage.prestationsMenuTitle,
    prestationsIntro: adminPage.prestationsIntro,
    prestationsMenu: adminPage.prestationsMenu,
    actualitesIntro: adminPage.actualitesIntro,
    actualitesItems: adminPage.actualitesItems,
    circleIntro: adminPage.circleIntro,
    circlePartners: adminPage.circlePartners,
    seoTitle: adminPage.seoTitle,
    seoDescription: adminPage.seoDescription,
    source: "admin",
  };
}
