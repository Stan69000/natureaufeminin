import { siteConfig } from "./site";

const pageDescriptions: Record<string, string> = {
  "/":
    "Naturopathe, conseillère en symptothermie et doula à Fleurieux-sur-l'Arbresle. Consultations au cabinet, à domicile ou en visio.",
  "/qui-suis-je":
    "Découvrez le parcours d'Audrey Martinez Bouchet, naturopathe spécialisée en santé féminine, symptothermie et accompagnement doula.",
  "/prestations":
    "Explorez les accompagnements proposés: naturopathie, écoute corporelle, symptothermie et doula.",
  "/prestations/naturopathie":
    "Accompagnement en naturopathie féminine pour retrouver équilibre, vitalité et mieux-être au quotidien.",
  "/prestations/ecoute-corporelle":
    "L'écoute corporelle par la Voie des Sens pour apaiser la charge émotionnelle et retrouver un ancrage durable.",
  "/prestations/symptothermie":
    "Apprenez à comprendre votre cycle menstruel grâce à la symptothermie pour contraception naturelle ou projet de conception.",
  "/prestations/doula":
    "Accompagnement doula en préconception, grossesse et post-partum avec une approche humaine et personnalisée.",
  "/tarifs":
    "Consultez les tarifs des accompagnements en symptothermie, naturopathie, doula et massages.",
  "/actualites":
    "Retrouvez les ateliers, événements et actualités de Natur' Au Feminin.",
  "/mon-cercle":
    "Découvrez mon cercle de partenaires de confiance pour un accompagnement complémentaire autour de la santé féminine.",
  "/contact":
    "Prenez contact pour réserver un accompagnement en naturopathie, symptothermie ou doula.",
  "/mentions-legales":
    "Consultez les mentions légales du site Natur' Au Feminin.",
  "/politique-de-confidentialite":
    "Consultez la politique de confidentialité et la gestion des données personnelles de Natur' Au Feminin.",
};

export function getDefaultPageDescription(pathname: string): string {
  return pageDescriptions[pathname] ?? siteConfig.description;
}
