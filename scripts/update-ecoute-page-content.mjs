import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

const title = "L’écoute Corporelle par La Voie des Sens";

const bodyHtml = `
<p>Est-ce qu’il vous est déjà arrivé d’être dépassé.e par une émotion si forte, que vous n’arrivez plus à respirer, ou qu’une boule se forme dans votre ventre, et que parfois même cette émotion vous fige complètement&nbsp;?</p>
<p>C’est ce qui m’arrivait de temps en temps. L’écoute corporelle est entrée dans ma vie il y a quelques années et je l’utilise au quotidien.</p>
<p>Ce que j’aime avec cette technique, c’est qu’elle ne retire pas l’émotion en elle-même, ni les souvenirs qui y sont liés&nbsp;: elle permet surtout d’apaiser la surcharge qui nous empêche de vivre normalement.</p>
<p>On peut ensuite envisager plus sereinement un entretien, un voyage en avion, ou toute autre situation qui pourrait être source de stress.</p>
<p>Aujourd’hui, j’utilise une approche appelée <strong>La Voie des Sens</strong>. Nous faisons le lien entre émotion et sensation. Afin d’obtenir des résultats durables, nous déterminons ensemble le nombre de séances nécessaires lors d’un premier entretien (bilan). Je vous donne les clés pour vous aider à mieux résoudre les émotions qui vous empêchent de vivre sereinement.</p>
`.trim();

async function main() {
  const page = await client.fetch(
    '*[_type == "page" && slug.current == "lecoute-corporelle-par-la-voie-des-sens"][0]{_id}',
  );

  if (!page?._id) {
    throw new Error('Page "lecoute-corporelle-par-la-voie-des-sens" introuvable dans Sanity.');
  }

  await client.patch(page._id).set({ title, bodyHtml }).unset(["body"]).commit();
  console.log(`Updated ${page._id}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
