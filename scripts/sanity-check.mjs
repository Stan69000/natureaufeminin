import { getSanityEnv } from "./lib/load-dotenv.mjs";

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

async function main() {
  const config = getSanityEnv();
  const countPayload = await runQuery(config, 'count(*[_type == "page"])');
  const slugsPayload = await runQuery(
    config,
    '*[_type == "page"][0...20]{"slug": slug.current, title}',
  );

  console.log("Sanity connection: OK");
  console.log(`Project: ${config.projectId}`);
  console.log(`Dataset: ${config.dataset}`);
  console.log(`Pages count: ${countPayload.result}`);
  console.log("Sample pages:");
  for (const item of slugsPayload.result ?? []) {
    console.log(`- ${item.slug} (${item.title})`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
