import { getCliClient } from "sanity/cli";
import { randomUUID } from "node:crypto";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
});

function block(text, style = "normal") {
  return {
    _key: randomUUID().slice(0, 12),
    _type: "block",
    style,
    markDefs: [],
    children: [
      {
        _key: randomUUID().slice(0, 12),
        _type: "span",
        marks: [],
        text,
      },
    ],
  };
}

function section(title, paragraphs) {
  return [block(title, "h2"), ...paragraphs.map((p) => block(p))];
}

const MENTIONS_BLOCKS = [
  ...section("Éditeur du site", [
    "Le site https://naturaufeminin.fr/ est édité par Audrey MARTINEZ-BOUCHET (Natur' Au Féminin), 69210 Fleurieux-sur-l'Arbresle.",
    "Directrice de la publication : Audrey MARTINEZ-BOUCHET. SIRET : 888 424 199 00014. Téléphone : 06 44 09 21 12. Contact : via la page Contact.",
  ]),
  ...section("Hébergement", [
    "Le site est hébergé par o2switch, 222-224 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France.",
  ]),
  ...section("Conception et gestion technique", [
    "Le site est développé avec Astro et le contenu est administré via Sanity Studio.",
  ]),
  ...section("Propriété intellectuelle", [
    "L'ensemble des contenus présents sur ce site (textes, images, logos, éléments graphiques) est protégé par le Code de la propriété intellectuelle. Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, sans autorisation écrite préalable, est interdite.",
  ]),
  ...section("Responsabilité", [
    "L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations publiées. Toutefois, il ne peut garantir l'absence d'erreurs ou d'omissions, ni l'absence d'interruption du site.",
  ]),
  ...section("Liens externes", [
    "Le site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur politique de confidentialité ou leur disponibilité.",
  ]),
];

const PRIVACY_BLOCKS = [
  ...section("1. Responsable du traitement", [
    "Le responsable du traitement des données est Audrey MARTINEZ-BOUCHET (Natur' Au Féminin), éditrice du site https://naturaufeminin.fr/.",
  ]),
  ...section("2. Données collectées", [
    "Les données personnelles peuvent être collectées lorsque vous utilisez le formulaire de contact (nom, adresse e-mail, sujet, message) afin de pouvoir traiter votre demande et vous répondre.",
    "Le site ne propose pas d'espace membre ni de publication de commentaires.",
  ]),
  ...section("3. Finalités et base légale", [
    "Les données sont utilisées uniquement pour répondre à vos demandes de contact et assurer le suivi des échanges.",
    "La base légale est votre consentement (article 6.1.a du RGPD) et, selon le cas, l'intérêt légitime à assurer le suivi de la relation (article 6.1.f).",
  ]),
  ...section("4. Destinataires des données", [
    "Les données sont destinées à Natur' Au Féminin et ne sont pas vendues à des tiers. Elles peuvent être traitées par des prestataires techniques nécessaires au fonctionnement du site (hébergement, administration du contenu).",
  ]),
  ...section("5. Durée de conservation", [
    "Les données issues du formulaire de contact sont conservées pendant la durée nécessaire au traitement de votre demande, puis archivées au maximum 12 mois, sauf obligation légale contraire.",
  ]),
  ...section("6. Cookies et traceurs", [
    "Le site utilise des cookies strictement nécessaires à son fonctionnement technique. Aucun dispositif publicitaire n'est activé sur le site à ce jour.",
    "Des services tiers accessibles depuis le site (par exemple vidéos intégrées ou liens externes) peuvent déposer leurs propres cookies lorsque vous interagissez avec eux.",
  ]),
  ...section("7. Vos droits", [
    "Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et, le cas échéant, de portabilité de vos données.",
    "Vous pouvez exercer vos droits via la page Contact. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr).",
  ]),
  ...section("8. Sécurité", [
    "Des mesures techniques et organisationnelles raisonnables sont mises en oeuvre pour protéger les données personnelles contre l'accès non autorisé, la perte, l'altération ou la divulgation.",
  ]),
  ...section("9. Mise à jour", [
    "La présente politique peut être mise à jour à tout moment. Dernière mise à jour : 04/04/2026.",
  ]),
];

async function patchBySlug(slug, patch) {
  const page = await client.fetch(
    '*[_type == "page" && slug.current == $slug][0]{_id,title,slug}',
    { slug },
  );

  if (!page?._id) {
    throw new Error(`Page "${slug}" introuvable dans Sanity.`);
  }

  await client.patch(page._id).set(patch).unset(["bodyHtml"]).commit();
  return page._id;
}

async function main() {
  const mentionsId = await patchBySlug("mentions-legales", {
    title: "Mentions Légales",
    body: MENTIONS_BLOCKS,
  });

  const privacyId = await patchBySlug("politique-de-confidentialite", {
    title: "Politique de confidentialité",
    body: PRIVACY_BLOCKS,
  });

  console.log(`Updated mentions-legales on ${mentionsId}`);
  console.log(`Updated politique-de-confidentialite on ${privacyId}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

