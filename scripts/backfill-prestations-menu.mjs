import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

const defaultMenu = [
  {
    label: "Naturopathie",
    href: "/prestations/naturopathie",
    description: "Retrouver un equilibre durable grace a une approche globale.",
  },
  {
    label: "L’écoute Corporelle par La Voie des Sens",
    href: "/prestations/ecoute-corporelle",
    description: "Apaiser les surcharges emotionnelles et retrouver de l'espace interieur.",
  },
  {
    label: "Symptothermie",
    href: "/prestations/symptothermie",
    description: "Comprendre votre cycle pour la contraception naturelle ou la conception.",
  },
  {
    label: "Doula",
    href: "/prestations/doula",
    description: "Un accompagnement humain autour de la preconception, grossesse et post-partum.",
  },
];

async function main() {
  const page = await client.fetch(
    '*[_type == "page" && slug.current == "prestations"][0]{_id}',
  );

  if (!page?._id) {
    throw new Error('Page "prestations" introuvable dans Sanity.');
  }

  await client
    .patch(page._id)
    .set({
      prestationsMenuTitle: "Nos accompagnements",
      prestationsIntro:
        "Afin de vous accompagner au mieux dans vos changements de vie, voici les différentes prestations que je propose :",
      prestationsMenu: defaultMenu.map((item) => ({
        _key: randomUUID().slice(0, 12),
        _type: "prestationsMenuItem",
        ...item,
      })),
    })
    .commit();

  console.log(`Updated prestations menu on ${page._id}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
