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
    return raw;
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

export function sanitizeYoutubeVideoId(value: string): string | null {
  const videoId = value.trim();
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return null;
  }
  return videoId;
}
