import { randomUUID } from "node:crypto";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const mediaMapPath = path.join(rootDir, "src/data/wp-media-map.json");
const mediaMap = JSON.parse(readFileSync(mediaMapPath, "utf-8"));

function decodeEntities(input) {
  return String(input || "")
    .replaceAll("&#038;", "&")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&rsquo;", "'")
    .replaceAll("&ldquo;", '"')
    .replaceAll("&rdquo;", '"')
    .replaceAll("&ndash;", "-")
    .replaceAll("&mdash;", "-")
    .replaceAll("&#8211;", "-")
    .replaceAll("&#8217;", "'")
    .replaceAll("&#39;", "'");
}

function getAttr(tag, name) {
  const regex = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i");
  const match = tag.match(regex);
  return match?.[1] ? decodeEntities(match[1].trim()) : "";
}

function textChunkToBlocks(chunk) {
  const withBreaks = chunk
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h1|h2|h3|h4|h5|h6|li|ul|ol|blockquote|div|figure)>/gi, "\n\n");

  const textOnly = withBreaks
    .replace(/<[^>]+>/g, "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!textOnly) return [];

  return decodeEntities(textOnly)
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({
      _key: randomUUID().slice(0, 12),
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: randomUUID().slice(0, 12),
          _type: "span",
          marks: [],
          text,
        },
      ],
    }));
}

function countLegacyImgs(html) {
  if (!html) return 0;
  const matches = String(html).match(/<img\b/gi);
  return matches ? matches.length : 0;
}

function countPortableImages(body) {
  if (!Array.isArray(body)) return 0;
  return body.filter((block) => block?._type === "image" && block?.asset?._ref).length;
}

function normalizeImageSource(src) {
  const raw = decodeEntities(src || "").trim();
  if (!raw) return "";
  if (raw.startsWith("//")) return `https:${raw}`;
  return raw;
}

function resolveSourceToUpload(source) {
  const mapped = mediaMap[source];
  if (mapped && mapped.startsWith("/")) {
    const localPath = path.join(publicDir, mapped.replace(/^\//, ""));
    if (existsSync(localPath)) {
      return {
        key: `file:${localPath}`,
        type: "file",
        filePath: localPath,
        filename: path.basename(localPath),
      };
    }
  }

  if (source.startsWith("/")) {
    const localPath = path.join(publicDir, source.replace(/^\//, ""));
    if (existsSync(localPath)) {
      return {
        key: `file:${localPath}`,
        type: "file",
        filePath: localPath,
        filename: path.basename(localPath),
      };
    }
  }

  if (source.startsWith("http://") || source.startsWith("https://")) {
    return {
      key: `url:${source}`,
      type: "url",
      url: source,
      filename: path.basename(new URL(source).pathname) || "image",
    };
  }

  return null;
}

async function uploadImageAsset(source, cache) {
  const resolved = resolveSourceToUpload(source);
  if (!resolved) return null;

  const cached = cache.get(resolved.key);
  if (cached) return cached;

  let asset;
  if (resolved.type === "file") {
    asset = await client.assets.upload("image", createReadStream(resolved.filePath), {
      filename: resolved.filename,
    });
  } else {
    const response = await fetch(resolved.url);
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    asset = await client.assets.upload("image", buffer, {
      filename: resolved.filename,
      contentType,
    });
  }

  if (!asset?._id) return null;
  cache.set(resolved.key, asset._id);
  return asset._id;
}

async function htmlToPortableBlocks(html, cache) {
  const cleaned = String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");

  const blocks = [];
  const imageRegex = /<img\b[^>]*>/gi;
  let cursor = 0;
  let match;

  while ((match = imageRegex.exec(cleaned)) !== null) {
    const before = cleaned.slice(cursor, match.index);
    blocks.push(...textChunkToBlocks(before));

    const imgTag = match[0];
    const src = normalizeImageSource(getAttr(imgTag, "src"));
    const alt = getAttr(imgTag, "alt");

    if (src) {
      const assetId = await uploadImageAsset(src, cache);
      if (assetId) {
        blocks.push({
          _key: randomUUID().slice(0, 12),
          _type: "image",
          asset: {
            _type: "reference",
            _ref: assetId,
          },
          alt: alt || "Illustration Natur Au Feminin",
        });
      }
    }

    cursor = match.index + imgTag.length;
  }

  const rest = cleaned.slice(cursor);
  blocks.push(...textChunkToBlocks(rest));
  return blocks;
}

async function main() {
  const pages = await client.fetch(
    `*[_type == "page"]{
      _id,
      title,
      "slug": slug.current,
      bodyHtml,
      body,
      "hasBody": defined(body) && length(body) > 0
    }`,
  );

  const uploadCache = new Map();
  let migrated = 0;
  let skippedNoHtml = 0;
  let skippedHasBody = 0;
  let migratedReplaceNoPortableImages = 0;
  let skippedEmptyBlocks = 0;

  for (const page of pages) {
    if (!page.bodyHtml || String(page.bodyHtml).trim().length === 0) {
      skippedNoHtml += 1;
      continue;
    }
    const legacyImgs = countLegacyImgs(page.bodyHtml);
    const portableImgs = countPortableImages(page.body);
    const shouldReplaceExistingBody =
      page.hasBody && legacyImgs > 0 && portableImgs === 0;

    if (page.hasBody && !shouldReplaceExistingBody) {
      skippedHasBody += 1;
      continue;
    }

    const blocks = await htmlToPortableBlocks(page.bodyHtml, uploadCache);
    if (!blocks.length) {
      skippedEmptyBlocks += 1;
      continue;
    }

    await client.patch(page._id).set({ body: blocks }).commit();
    migrated += 1;
    if (shouldReplaceExistingBody) {
      migratedReplaceNoPortableImages += 1;
      console.log(
        `Migrated (replaced existing body to restore images): ${page.title} (${page.slug || page._id})`,
      );
    } else {
      console.log(`Migrated: ${page.title} (${page.slug || page._id})`);
    }
  }

  console.log(
    `Done. Migrated=${migrated} (ReplacedExistingBody=${migratedReplaceNoPortableImages}), SkippedNoHtml=${skippedNoHtml}, SkippedHasBody=${skippedHasBody}, SkippedEmpty=${skippedEmptyBlocks}, Total=${pages.length}`,
  );
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
