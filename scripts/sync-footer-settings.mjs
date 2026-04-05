import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

function keyedLink(type, label, href) {
  return {
    _key: randomUUID().slice(0, 12),
    _type: type,
    label,
    href,
  };
}

async function main() {
  const docId = "footerSettings";

  await client.createIfNotExists({
    _id: docId,
    _type: "footerSettings",
  });

  await client
    .patch(docId)
    .set({
      brandPoints: ["Naturopathie", "Symptothermie", "Doula", "Régulation émotionnelle"],
      contactTitle: "Contact",
      contactItems: [
        keyedLink("contactItem", "06 44 09 21 12", "tel:+33644092112"),
        {
          _key: randomUUID().slice(0, 12),
          _type: "contactItem",
          label: "Fleurieux-sur-l'Arbresle",
        },
        keyedLink("contactItem", "Prendre rendez-vous", "/contact"),
      ],
      accompagnementsTitle: "Accompagnements",
      accompagnements: [
        keyedLink("accompagnementItem", "Naturopathie feminine", "/prestations/naturopathie"),
        keyedLink("accompagnementItem", "Symptothermie", "/prestations/symptothermie"),
        keyedLink("accompagnementItem", "Doula", "/prestations/doula"),
        keyedLink("accompagnementItem", "Ecoute corporelle", "/prestations/ecoute-corporelle"),
      ],
      accompagnementsAllLabel: "Voir toutes les prestations",
      accompagnementsAllHref: "/prestations",
      specialitesTitle: "Spécialités",
      specialites: [
        "Gestion du stress",
        "Equilibre emotionnel",
        "Cycle feminin",
        "Syndrome premenstruel",
        "Puberte",
        "Menopause",
        "Accompagnement prenatal",
        "Allaitement",
        "Massage femme enceinte",
        "Massage bebe",
      ],
      informationsTitle: "Informations",
      informations: [
        keyedLink("informationItem", "Mentions legales", "/mentions-legales"),
        keyedLink("informationItem", "Politique de confidentialite", "/politique-de-confidentialite"),
        keyedLink("informationItem", "Plan du site (XML)", "/sitemap.xml"),
        keyedLink("informationItem", "Admin", "https://naturaufeminin-admin.sanity.studio/"),
      ],
    })
    .commit();

  console.log(`Synced footer settings on ${docId}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
