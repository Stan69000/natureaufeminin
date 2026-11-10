import { siteConfig } from "../data/site";

interface UrlPolicy {
  allowRelative?: boolean;
  allowedProtocols?: readonly string[];
}

const DEFAULT_ALLOWED_PROTOCOLS = ["https:"] as const;

export function sanitizeCmsUrl(input: string | undefined, policy: UrlPolicy = {}): string | null {
  const raw = input?.trim();
  if (!raw) return null;
  if (/[\u0000-\u001F\u007F]/.test(raw)) return null;

  if (policy.allowRelative && /^\/(?!\/)/.test(raw)) {
    return withTrailingSlash(raw);
  }

  let url: URL;
  try {
    url = new URL(raw, siteConfig.url);
  } catch {
    return null;
  }

  const allowedProtocols = policy.allowedProtocols ?? DEFAULT_ALLOWED_PROTOCOLS;
  if (!allowedProtocols.includes(url.protocol)) {
    return null;
  }

  return url.toString();
}

/**
 * Le site est construit avec `trailingSlash: 'always'` : Apache redirige
 * `/contact` vers `/contact/` (301). Un lien interne saisi sans slash dans
 * l'admin produirait donc une redirection sur chaque page où il apparaît
 * (« Page avec redirection » dans la Search Console). Les fichiers
 * (`/sitemap.xml`, `/doc.pdf`) sont laissés tels quels.
 */
export function withTrailingSlash(href: string): string {
  const match = /^([^?#]*)(.*)$/.exec(href);
  if (!match) return href;
  const [, path, suffix] = match;
  if (path.endsWith("/") || /\.[a-z0-9]+$/i.test(path)) return href;
  return `${path}/${suffix}`;
}

export function sanitizeYoutubeVideoId(value: string): string | null {
  const videoId = value.trim();
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return null;
  }
  return videoId;
}
