import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSanityEnv } from "./lib/load-dotenv.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const seedFile = path.join(rootDir, "sanity/seed.ndjson");

function buildQueryUrl({ projectId, dataset, apiVersion }, query) {
  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
  );
  url.searchParams.set("query", query);
  return url;
}

async function runQuery(config, query) {
  const response = await fetch(buildQueryUrl(config, query), {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Sanity query failed: HTTP ${response.status}`);
  }
  return response.json();
}

async function readExpectedSlugs() {
  const raw = await readFile(seedFile, "utf-8");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .map((doc) => doc?.slug?.current)
    .filter(Boolean)
    .sort();
}

async function main() {
  const config = getSanityEnv();
  const expectedSlugs = await readExpectedSlugs();
  const payload = await runQuery(config, '*[_type == "page"]{"slug": slug.current}');
  const existingSlugs = (payload.result ?? [])
    .map((doc) => doc.slug)
    .filter(Boolean)
    .sort();

  const existingSet = new Set(existingSlugs);
  const missing = expectedSlugs.filter((slug) => !existingSet.has(slug));

  console.log(`Expected pages: ${expectedSlugs.length}`);
  console.log(`Found in Sanity: ${existingSlugs.length}`);

  if (missing.length > 0) {
    console.log("Missing slugs:");
    for (const slug of missing) console.log(`- ${slug}`);
    process.exit(2);
  }

  console.log("Seed verification: OK (all expected pages found)");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
