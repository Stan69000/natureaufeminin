import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

const MENTIONS_HTML = `
<h2>Éditeur du site</h2>
<p>Le site <a href="https://naturaufeminin.fr/">https://naturaufeminin.fr/</a> est édité par Audrey MARTINEZ-BOUCHET (Natur' Au Féminin), 69210 Fleurieux-sur-l'Arbresle.</p>
<p><strong>Directrice de la publication :</strong> Audrey MARTINEZ-BOUCHET<br><strong>SIRET :</strong> 888 424 199 00014<br><strong>Téléphone :</strong> 06 44 09 21 12<br><strong>Contact :</strong> via la page <a href="/contact">Contact</a>.</p>

<h2>Hébergement</h2>
<p>Le site est hébergé par <strong>o2switch</strong>, 222-224 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France.</p>

<h2>Conception et gestion technique</h2>
<p>Le site est développé avec Astro et le contenu est administré via Sanity Studio.</p>

<h2>Propriété intellectuelle</h2>
<p>L'ensemble des contenus présents sur ce site (textes, images, logos, éléments graphiques) est protégé par le Code de la propriété intellectuelle. Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, sans autorisation écrite préalable, est interdite.</p>

<h2>Responsabilité</h2>
<p>L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations publiées. Toutefois, il ne peut garantir l'absence d'erreurs ou d'omissions, ni l'absence d'interruption du site.</p>

<h2>Liens externes</h2>
<p>Le site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur politique de confidentialité ou leur disponibilité.</p>
`;

const PRIVACY_HTML = `
<h2>1. Responsable du traitement</h2>
<p>Le responsable du traitement des données est Audrey MARTINEZ-BOUCHET (Natur' Au Féminin), éditrice du site <a href="https://naturaufeminin.fr/">https://naturaufeminin.fr/</a>.</p>

<h2>2. Données collectées</h2>
<p>Les données personnelles peuvent être collectées lorsque vous utilisez le formulaire de contact (nom, adresse e-mail, sujet, message) afin de pouvoir traiter votre demande et vous répondre.</p>
<p>Le site ne propose pas d'espace membre ni de publication de commentaires.</p>

<h2>3. Finalités et base légale</h2>
<p>Les données sont utilisées uniquement pour :</p>
<ul>
  <li>répondre à vos demandes de contact ;</li>
  <li>assurer le suivi des échanges.</li>
</ul>
<p>La base légale est votre consentement (article 6.1.a du RGPD) et, selon le cas, l'intérêt légitime à assurer le suivi de la relation (article 6.1.f).</p>

<h2>4. Destinataires des données</h2>
<p>Les données sont destinées à Natur' Au Féminin et ne sont pas vendues à des tiers. Elles peuvent être traitées par des prestataires techniques nécessaires au fonctionnement du site (hébergement, administration du contenu).</p>

<h2>5. Durée de conservation</h2>
<p>Les données issues du formulaire de contact sont conservées pendant la durée nécessaire au traitement de votre demande, puis archivées au maximum 12 mois, sauf obligation légale contraire.</p>

<h2>6. Cookies et traceurs</h2>
<p>Le site utilise des cookies strictement nécessaires à son fonctionnement technique. Aucun dispositif publicitaire n'est activé sur le site à ce jour.</p>
<p>Des services tiers accessibles depuis le site (par exemple vidéos intégrées ou liens externes) peuvent déposer leurs propres cookies lorsque vous interagissez avec eux.</p>

<h2>7. Vos droits</h2>
<p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et, le cas échéant, de portabilité de vos données.</p>
<p>Vous pouvez exercer vos droits via la page <a href="/contact">Contact</a>. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr/">www.cnil.fr</a>).</p>

<h2>8. Sécurité</h2>
<p>Des mesures techniques et organisationnelles raisonnables sont mises en oeuvre pour protéger les données personnelles contre l'accès non autorisé, la perte, l'altération ou la divulgation.</p>

<h2>9. Mise à jour</h2>
<p>La présente politique peut être mise à jour à tout moment. Dernière mise à jour : 04/04/2026.</p>
`;

async function patchBySlug(slug, patch) {
  const page = await client.fetch(
    '*[_type == "page" && slug.current == $slug][0]{_id,title,slug}',
    { slug },
  );

  if (!page?._id) {
    throw new Error(`Page "${slug}" introuvable dans Sanity.`);
  }

  await client.patch(page._id).set(patch).commit();
  return page._id;
}

async function main() {
  const mentionsId = await patchBySlug("mentions-legales", {
    title: "Mentions Légales",
    bodyHtml: MENTIONS_HTML.trim(),
  });

  const privacyId = await patchBySlug("politique-de-confidentialite", {
    title: "Politique de confidentialité",
    bodyHtml: PRIVACY_HTML.trim(),
  });

  console.log(`Updated mentions-legales on ${mentionsId}`);
  console.log(`Updated politique-de-confidentialite on ${privacyId}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
