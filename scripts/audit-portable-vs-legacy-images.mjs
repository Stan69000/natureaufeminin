import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
});

function countLegacyImgs(html) {
  if (!html) return 0;
  const matches = String(html).match(/<img\b/gi);
  return matches ? matches.length : 0;
}

function countPortableImages(body) {
  if (!Array.isArray(body)) return 0;
  return body.filter((block) => block?._type === "image" && block?.asset?._ref).length;
}

async function main() {
  const pages = await client.fetch(
    `*[_type == "page"]|order(slug.current asc){
      title,
      "slug": slug.current,
      bodyHtml,
      "hasBodyHtml": defined(bodyHtml),
      body[]{
        _type,
        asset
      }
    }`,
  );

  console.log("slug | legacyImgs | portableImgs | hasBody | hasBodyHtml");
  for (const page of pages) {
    const legacyImgs = countLegacyImgs(page.bodyHtml);
    const portableImgs = countPortableImages(page.body);
    const hasBody = Array.isArray(page.body) && page.body.length > 0 ? "yes" : "no";
    const hasBodyHtml = page.hasBodyHtml ? "yes" : "no";
    console.log(`${page.slug} | ${legacyImgs} | ${portableImgs} | ${hasBody} | ${hasBodyHtml}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
