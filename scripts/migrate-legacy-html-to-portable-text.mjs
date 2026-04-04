import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

function decodeEntities(input) {
  return input
    .replaceAll("&#038;", "&")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&rsquo;", "'")
    .replaceAll("&ldquo;", '"')
    .replaceAll("&rdquo;", '"')
    .replaceAll("&ndash;", "-")
    .replaceAll("&mdash;", "-")
    .replaceAll("&#8211;", "-")
    .replaceAll("&#8217;", "'");
}

function htmlToParagraphs(html) {
  const noScript = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<table[\s\S]*?<\/table>/gi, "");

  const withBreaks = noScript
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h1|h2|h3|h4|h5|h6|li|ul|ol|blockquote)>/gi, "\n\n");

  const textOnly = withBreaks
    .replace(/<[^>]+>/g, "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return decodeEntities(textOnly)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function toPortableTextBlocks(paragraphs) {
  return paragraphs.map((text) => ({
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

async function main() {
  const pages = await client.fetch(
    `*[_type == "page"]{
      _id,
      title,
      bodyHtml,
      "hasBody": defined(body) && length(body) > 0
    }`,
  );

  let migrated = 0;
  let skipped = 0;

  for (const page of pages) {
    if (!page.bodyHtml || String(page.bodyHtml).trim().length === 0) {
      skipped += 1;
      continue;
    }
    if (page.hasBody) {
      skipped += 1;
      continue;
    }

    const paragraphs = htmlToParagraphs(String(page.bodyHtml || ""));
    if (paragraphs.length === 0) {
      skipped += 1;
      continue;
    }

    const blocks = toPortableTextBlocks(paragraphs);
    await client.patch(page._id).set({ body: blocks }).commit();
    migrated += 1;
    console.log(`Migrated: ${page.title} (${page._id})`);
  }

  console.log(`Done. Migrated=${migrated}, Skipped=${skipped}, Total=${pages.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
