/**
 * Correspondance entre les URL du site et les slugs des pages dans l'admin.
 *
 * Chaque page .astro connaît déjà son propre slug, mais le sitemap et les blocs
 * de liens raisonnent en chemins : sans cette carte, ils ne peuvent pas savoir
 * si la page visée est masquée côté admin.
 *
 * Les slugs viennent de l'ancien WordPress et ne suivent pas les URL actuelles
 * (« que-se-passe-t-il-en-ce-moment » pour /actualites/, par exemple) : d'où la
 * nécessité d'une table explicite plutôt que d'une règle de transformation.
 */
export const CMS_SLUG_BY_PATH: Record<string, string> = {
  "/": "accueil",
  "/qui-suis-je/": "qui-suis-je",
  "/prestations/": "prestations",
  "/prestations/naturopathie/": "naturopathie",
  "/prestations/ecoute-corporelle/": "lecoute-corporelle-par-la-voie-des-sens",
  "/prestations/symptothermie/": "gestion-naturelle-de-la-fertilite-symptothermie",
  "/prestations/doula/": "doula-un-bebe-pour-bientot",
  "/tarifs/": "tarifs",
  "/actualites/": "que-se-passe-t-il-en-ce-moment",
  "/mon-cercle/": "mon-cercle",
  "/contact/": "contact-prise-de-rendez-vous",
  "/menopause/": "menopause",
  "/mentions-legales/": "mentions-legales",
  "/politique-de-confidentialite/": "politique-de-confidentialite",
};
