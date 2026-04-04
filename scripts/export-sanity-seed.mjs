import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const inputFile = path.join(rootDir, "src/data/wp-pages.json");
const outDir = path.join(rootDir, "sanity");
const outFile = path.join(outDir, "seed.ndjson");

function docId(slug) {
  return `page-${slug.replace(/[^a-zA-Z0-9-_]/g, "-")}`;
}

async function main() {
  const raw = await readFile(inputFile, "utf-8");
  const pages = JSON.parse(raw);

  const lines = pages.map((page) =>
    JSON.stringify({
      _id: docId(page.slug),
      _type: "page",
      title: page?.title?.rendered ?? page.slug,
      slug: { _type: "slug", current: page.slug },
      bodyHtml: page?.content?.rendered ?? "",
      legacyWp: {
        _type: "object",
        id: page.id,
        link: page.link,
      },
    }),
  );

  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, lines.join("\n") + "\n", "utf-8");

  console.log(`Exported ${lines.length} pages -> ${path.relative(rootDir, outFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
