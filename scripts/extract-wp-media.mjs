import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const pagesFile = path.join(rootDir, "src/data/wp-pages.json");
const outDir = path.join(rootDir, "src/data");
const outFile = path.join(outDir, "wp-media-inventory.json");

const MEDIA_URL_REGEX = /https?:\/\/naturaufeminin\.fr\/wp-content\/uploads\/[^\s"'<>\\)]+/gi;

function normalizeUrl(url) {
  return url.replaceAll("&amp;", "&").trim();
}

function getRelativeMediaPath(url) {
  const pathname = new URL(url).pathname;
  const prefix = "/wp-content/uploads/";
  if (!pathname.startsWith(prefix)) return null;
  return pathname.slice(prefix.length);
}

async function main() {
  const raw = await readFile(pagesFile, "utf-8");
  const pages = JSON.parse(raw);
  const mediaMap = new Map();

  for (const page of pages) {
    const html = String(page?.content?.rendered ?? "");
    const matches = html.match(MEDIA_URL_REGEX) ?? [];
    for (const match of matches) {
      const sourceUrl = normalizeUrl(match);
      const relPath = getRelativeMediaPath(sourceUrl);
      if (!relPath) continue;

      const current = mediaMap.get(sourceUrl) ?? {
        sourceUrl,
        relativePath: relPath,
        pages: new Set(),
      };
      current.pages.add(page.slug);
      mediaMap.set(sourceUrl, current);
    }
  }

  const inventory = [...mediaMap.values()]
    .map((item) => ({
      sourceUrl: item.sourceUrl,
      relativePath: item.relativePath,
      pages: [...item.pages].sort(),
    }))
    .sort((a, b) => a.sourceUrl.localeCompare(b.sourceUrl));

  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, JSON.stringify(inventory, null, 2) + "\n", "utf-8");

  console.log(`Inventory generated: ${path.relative(rootDir, outFile)}`);
  console.log(`Unique media URLs: ${inventory.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
