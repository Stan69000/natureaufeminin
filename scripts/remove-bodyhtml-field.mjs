import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
});

async function main() {
  const rows = await client.fetch(
    `*[_type == "page"]{
      _id,
      title,
      "slug": slug.current,
      "bodyHtmlLength": length(coalesce(bodyHtml, ""))
    }`,
  );
  const pages = rows.filter((row) => Number(row.bodyHtmlLength || 0) > 0);
  if (!pages.length) {
    console.log("No page has bodyHtml. Nothing to do.");
    return;
  }

  for (const page of pages) {
    await client.patch(page._id).unset(["bodyHtml"]).commit();
    console.log(`Removed bodyHtml: ${page.slug || page._id} (${page.title})`);
  }

  console.log(`Done. Updated ${pages.length} page(s).`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
