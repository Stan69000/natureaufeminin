import { randomUUID } from "node:crypto";
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
      actualitesIntro:
        "Retrouvez ici les prochaines dates, ateliers et annonces importantes.",
      actualitesItems: [
        {
          _key: randomUUID().slice(0, 12),
          _type: "actualiteItem",
          title: "Atelier Cycle Menstruel",
          publishedAt: new Date().toISOString(),
          excerpt:
            "Le prochain atelier aura lieu le 27 avril à 10h sur le thème du cycle menstruel. Les places sont limitées pour privilégier la qualité des échanges.",
          youtubeUrl: "https://www.youtube.com/watch?v=KV60ZgnwJzk",
          ctaLabel: "Réserver un premier échange",
          ctaUrl: "https://liberlo.com/profil/audrey-martinez-bouchet/",
        },
      ],
    })
    .commit();

  console.log(`Updated actualites on ${page._id}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
