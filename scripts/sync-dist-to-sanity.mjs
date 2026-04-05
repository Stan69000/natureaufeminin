import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const pagesDir = path.join(rootDir, "src/pages");
const distDir = path.join(rootDir, "dist");

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

function decodeEntities(input) {
  return String(input || "")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#038;", "&")
    .replaceAll("&rsquo;", "'")
    .replaceAll("&ldquo;", '"')
    .replaceAll("&rdquo;", '"')
    .replaceAll("&ndash;", "-")
    .replaceAll("&mdash;", "-")
    .replaceAll("&#39;", "'");
}

function stripTags(input) {
  return decodeEntities(String(input || "").replace(/<[^>]+>/g, "")).trim();
}

function htmlToPortableBlocks(html) {
  const cleaned = String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<table[\s\S]*?<\/table>/gi, "");

  const withBreaks = cleaned
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
    .map((p) => p.trim())
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

async function listAstroPages(dir) {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listAstroPages(full)));
      continue;
    }
    if (!entry.name.endsWith(".astro")) continue;
    files.push(full);
  }
  return files;
}

function routeFromFile(filePath) {
  const rel = path.relative(pagesDir, filePath).replace(/\\/g, "/");
  if (rel === "index.astro") return "/";
  if (rel.endsWith("/index.astro")) {
    return `/${rel.slice(0, -"index.astro".length - 1)}`;
  }
  return `/${rel.replace(/\.astro$/, "")}`;
}

function extractSanitySlug(source) {
  const constSlug = source.match(/const\s+slug\s*=\s*"([^"]+)"/);
  if (constSlug?.[1]) return constSlug[1];
  const direct = source.match(/getPageContent\("([^"]+)"\)/);
  return direct?.[1] || null;
}

function extractArticleInner(html) {
  const article = html.match(/<article[^>]*class="[^"]*wp-content[^"]*"[^>]*>([\s\S]*?)<\/article>/i);
  if (!article?.[1]) return "";
  return article[1]
    .replace(/<h[12][^>]*id="page-title"[^>]*>[\s\S]*?<\/h[12]>/i, "")
    .trim();
}

function extractPageTitle(html) {
  const h1 = html.match(/<h1[^>]*id="page-title"[^>]*>([\s\S]*?)<\/h1>/i);
  return stripTags(h1?.[1] || "");
}

function extractTarifsSections(articleInner) {
  const sections = [];
  const sectionMatches = articleInner.matchAll(
    /<section[^>]*class="[^"]*tarif-card[^"]*"[^>]*>([\s\S]*?)<\/section>/gi,
  );
  for (const sectionMatch of sectionMatches) {
    const block = sectionMatch[1] || "";
    const titleMatch = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const title = stripTags(titleMatch?.[1] || "");
    if (!title) continue;

    const items = [];
    const itemMatches = block.matchAll(/<li[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*<\/li>/gi);
    for (const itemMatch of itemMatches) {
      const label = stripTags(itemMatch[1] || "");
      const price = stripTags(itemMatch[2] || "");
      if (label && price) {
        items.push({
          _key: randomUUID().slice(0, 12),
          _type: "pricingItem",
          label,
          price,
        });
      }
    }
    if (items.length > 0) {
      sections.push({
        _key: randomUUID().slice(0, 12),
        _type: "pricingSection",
        title,
        items,
      });
    }
  }
  return sections;
}

function distFileFromRoute(route) {
  if (route === "/") return path.join(distDir, "index.html");
  return path.join(distDir, route.replace(/^\//, ""), "index.html");
}

async function main() {
  try {
    await access(distDir);
  } catch {
    throw new Error("Missing dist/. Lance `npm run build` avant la sync locale.");
  }

  const astroFiles = await listAstroPages(pagesDir);
  const routeSlugPairs = [];
  for (const file of astroFiles) {
    if (file.endsWith("sitemap-index.xml.ts")) continue;
    const source = await readFile(file, "utf-8");
    const sanitySlug = extractSanitySlug(source);
    if (!sanitySlug) continue;
    routeSlugPairs.push({ route: routeFromFile(file), sanitySlug });
  }

  let updated = 0;
  let skipped = 0;

  for (const { route, sanitySlug } of routeSlugPairs) {
    const htmlFile = distFileFromRoute(route);
    let html = "";
    try {
      html = await readFile(htmlFile, "utf-8");
    } catch {
      skipped += 1;
      continue;
    }

    const title = extractPageTitle(html);
    const articleInner = extractArticleInner(html);
    if (!articleInner) {
      skipped += 1;
      continue;
    }

    const pageDoc = await client.fetch(
      `*[_type == "page" && slug.current == $slug][0]{_id}`,
      { slug: sanitySlug },
    );
    if (!pageDoc?._id) {
      skipped += 1;
      continue;
    }

    const body = htmlToPortableBlocks(articleInner);
    const patch = client.patch(pageDoc._id).set({
      ...(title ? { title } : {}),
      ...(body.length > 0 ? { body } : {}),
    }).unset(["bodyHtml"]);

    if (sanitySlug === "tarifs") {
      const pricingSections = extractTarifsSections(articleInner);
      patch.set({ pricingSections });
    }

    if (!dryRun) {
      await patch.commit();
    }
    updated += 1;
  }

  console.log(`Pages candidates: ${routeSlugPairs.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Mode: ${dryRun ? "dry-run" : "write"}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
