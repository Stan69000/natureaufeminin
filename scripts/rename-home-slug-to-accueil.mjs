import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

async function main() {
  const existingAccueil = await client.fetch(
    '*[_type == "page" && slug.current == "accueil"][0]{_id,title,"slug":slug.current}',
  );

  if (existingAccueil?._id) {
    console.log(`Home slug already renamed: ${existingAccueil._id} (${existingAccueil.slug})`);
    return;
  }

  const legacyHome = await client.fetch(
    '*[_type == "page" && slug.current == "page-d-exemple"][0]{_id,title}',
  );

  if (!legacyHome?._id) {
    throw new Error('Aucune page trouvée avec le slug "page-d-exemple".');
  }

  await client
    .patch(legacyHome._id)
    .set({
      slug: { _type: "slug", current: "accueil" },
      title: legacyHome.title?.trim() || "Accueil",
    })
    .commit();

  console.log(`Renamed home slug to "accueil" on ${legacyHome._id}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

