import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

async function main() {
  const page = await client.fetch('*[_type == "page" && slug.current == "mon-cercle"][0]{_id}');

  if (!page?._id) {
    throw new Error('Page "mon-cercle" introuvable dans Sanity.');
  }

  await client
    .patch(page._id)
    .set({
      circleIntro:
        "Une sélection de professionnel.le.s complétant mon approche. Je connais personnellement ces accompagnant.e.s et n'ai aucun mal à vous les recommander !",
      circlePartners: [
        {
          _key: randomUUID().slice(0, 12),
          _type: "circlePartnerItem",
          name: "Andréa MALTERRE",
          role: "Photographe médecine et doula sauvage",
          websiteUrl: "https://www.centaureadoula.com/",
        },
        {
          _key: randomUUID().slice(0, 12),
          _type: "circlePartnerItem",
          name: "Caroline RODRIGUES-MILLET",
          role: "Le Cocon Doula",
          websiteUrl: "https://www.lecocondoula.com/",
        },
        {
          _key: randomUUID().slice(0, 12),
          _type: "circlePartnerItem",
          name: "Natascha WITTEKIND",
          role: "Résolution émotionnelle à Sorrèze (81)",
          websiteUrl: "https://nataschawittekind.com/",
        },
      ],
    })
    .commit();

  console.log(`Updated mon-cercle partners on ${page._id}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

