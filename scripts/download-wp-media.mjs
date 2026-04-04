import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const inventoryFile = path.join(rootDir, "src/data/wp-media-inventory.json");
const outMediaRoot = path.join(rootDir, "public/media/legacy-wp");
const outMapFile = path.join(rootDir, "src/data/wp-media-map.json");
const outReportFile = path.join(rootDir, "src/data/wp-media-download-report.json");

const USER_AGENT = "natureaufeminin-media-migrator/1.0";

async function downloadFile(url, outputPath) {
  const response = await fetch(url, {
    headers: { "user-agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, bytes);
}

async function main() {
  const raw = await readFile(inventoryFile, "utf-8");
  const inventory = JSON.parse(raw);

  const map = {};
  const report = {
    total: inventory.length,
    downloaded: 0,
    failed: 0,
    failures: [],
  };

  for (const item of inventory) {
    const rel = String(item.relativePath || "").replace(/^\/+/, "");
    const sourceUrl = String(item.sourceUrl || "");
    if (!rel || !sourceUrl) continue;

    const targetDiskPath = path.join(outMediaRoot, rel);
    const publicUrl = `/media/legacy-wp/${rel}`.replaceAll("\\", "/");

    try {
      await downloadFile(sourceUrl, targetDiskPath);
      map[sourceUrl] = publicUrl;
      report.downloaded += 1;
      console.log(`OK ${sourceUrl} -> ${publicUrl}`);
    } catch (error) {
      report.failed += 1;
      report.failures.push({
        sourceUrl,
        relativePath: rel,
        message: error instanceof Error ? error.message : String(error),
      });
      console.error(`FAIL ${sourceUrl} (${error})`);
    }
  }

  await writeFile(outMapFile, JSON.stringify(map, null, 2) + "\n", "utf-8");
  await writeFile(outReportFile, JSON.stringify(report, null, 2) + "\n", "utf-8");

  console.log(`Map generated: ${path.relative(rootDir, outMapFile)}`);
  console.log(`Report generated: ${path.relative(rootDir, outReportFile)}`);
  console.log(`Downloaded: ${report.downloaded}/${report.total}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
