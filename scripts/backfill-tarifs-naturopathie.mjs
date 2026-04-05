import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

const naturopathieSection = {
  _key: randomUUID().slice(0, 12),
  _type: "pricingSection",
  title: "Naturopathie",
  items: [
    {
      _key: randomUUID().slice(0, 12),
      _type: "pricingItem",
      label: "Bilan Naturopathique (2h)",
      price: "90.00 €",
    },
    {
      _key: randomUUID().slice(0, 12),
      _type: "pricingItem",
      label: "Consultation de suivi en Naturopathie (1h30)",
      price: "75.00 €",
    },
    {
      _key: randomUUID().slice(0, 12),
      _type: "pricingItem",
      label: "Bilan La Voie des Sens (2h)",
      price: "90.00 €",
    },
    {
      _key: randomUUID().slice(0, 12),
      _type: "pricingItem",
      label: "Consultation de suivi La Voie des Sens (1h30)",
      price: "85.00 €",
    },
    {
      _key: randomUUID().slice(0, 12),
      _type: "pricingItem",
      label: "Prix Solidaire - La Voie des Sens (1h30)",
      price: "50.00 €",
    },
    {
      _key: randomUUID().slice(0, 12),
      _type: "pricingItem",
      label: "Séance de suivi Symptothermie (1h30)",
      price: "60.00 €",
    },
    {
      _key: randomUUID().slice(0, 12),
      _type: "pricingItem",
      label: "Forfait 1 année avec la Naturopathie (1h30) - 6 séances",
      price: "415.00 €",
    },
    {
      _key: randomUUID().slice(0, 12),
      _type: "pricingItem",
      label: "Forfait suivi La Voie des Sens (1h30) - 3 séances",
      price: "240.00 €",
    },
    {
      _key: randomUUID().slice(0, 12),
      _type: "pricingItem",
      label: "Le cycle dans toute sa splendeur (1h30) - 5 séances",
      price: "250.00 €",
    },
  ],
};

async function main() {
  const page = await client.fetch(
    '*[_type == "page" && slug.current == "tarifs"][0]{_id, pricingSections}',
  );

  if (!page?._id) {
    throw new Error('Page "tarifs" introuvable dans Sanity.');
  }

  const currentSections = Array.isArray(page.pricingSections) ? page.pricingSections : [];
  const nextSections = currentSections.filter(
    (section) => section?.title?.trim().toLowerCase() !== "naturopathie",
  );
  nextSections.push(naturopathieSection);

  await client
    .patch(page._id)
    .set({
      pricingSections: nextSections,
    })
    .commit();

  console.log(`Updated tarifs pricing sections on ${page._id} (Naturopathie section upserted).`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

