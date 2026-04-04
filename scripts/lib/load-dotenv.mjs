import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");

export function loadDotenv() {
  const envFile = path.join(rootDir, ".env");
  if (!existsSync(envFile)) return;

  const lines = readFileSync(envFile, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

export function getSanityEnv() {
  loadDotenv();
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";

  if (!projectId || !dataset) {
    throw new Error(
      "Missing SANITY_PROJECT_ID or SANITY_DATASET. Fill .env from .env.example first.",
    );
  }

  return { projectId, dataset, apiVersion };
}
