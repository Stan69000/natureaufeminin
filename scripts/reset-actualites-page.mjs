import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

async function main() {
  const page = await client.fetch(
    '*[_type == "page" && slug.current == "que-se-passe-t-il-en-ce-moment"][0]{_id}',
  );

  if (!page?._id) {
    throw new Error('Page "que-se-passe-t-il-en-ce-moment" introuvable dans Sanity.');
  }

  await client
    .patch(page._id)
    .set({
      title: "Actualités",
      actualitesIntro: "Retrouvez ici les prochaines dates, ateliers et annonces importantes.",
      actualitesItems: [],
    })
    .unset([
      "actualitesFeaturedTitle",
      "actualitesFeaturedPublishedAt",
      "actualitesFeaturedExcerpt",
    ])
    .commit();

  console.log(`Reset actualites on ${page._id}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
