import { getCliClient } from "sanity/cli";
import { randomUUID } from "node:crypto";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

const title = "L’écoute Corporelle par La Voie des Sens";

const paragraphs = [
  "Est-ce qu’il vous est déjà arrivé d’être dépassé.e par une émotion si forte, que vous n’arrivez plus à respirer, ou qu’une boule se forme dans votre ventre, et que parfois même cette émotion vous fige complètement ?",
  "C’est ce qui m’arrivait de temps en temps. L’écoute corporelle est entrée dans ma vie il y a quelques années et je l’utilise au quotidien.",
  "Ce que j’aime avec cette technique, c’est qu’elle ne retire pas l’émotion en elle-même, ni les souvenirs qui y sont liés : elle permet surtout d’apaiser la surcharge qui nous empêche de vivre normalement.",
  "On peut ensuite envisager plus sereinement un entretien, un voyage en avion, ou toute autre situation qui pourrait être source de stress.",
  "Aujourd’hui, j’utilise une approche appelée La Voie des Sens. Nous faisons le lien entre émotion et sensation. Afin d’obtenir des résultats durables, nous déterminons ensemble le nombre de séances nécessaires lors d’un premier entretien (bilan). Je vous donne les clés pour vous aider à mieux résoudre les émotions qui vous empêchent de vivre sereinement.",
];

function toPortableBlocks(items) {
  return items.map((text) => ({
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
  const page = await client.fetch(
    '*[_type == "page" && slug.current == "lecoute-corporelle-par-la-voie-des-sens"][0]{_id}',
  );

  if (!page?._id) {
    throw new Error('Page "lecoute-corporelle-par-la-voie-des-sens" introuvable dans Sanity.');
  }

  await client.patch(page._id).set({ title, body: toPortableBlocks(paragraphs) }).unset(["bodyHtml"]).commit();
  console.log(`Updated ${page._id}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
