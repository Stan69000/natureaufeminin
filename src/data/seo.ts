import { siteConfig } from "./site";

interface DefaultPageSeo {
  title: string;
  description: string;
  keywords: string;
}

const defaultPageSeoByPath: Record<string, DefaultPageSeo> = {
  "/": {
    title:
      "Naturopathe Ouest Lyonnais, Symptothermie & Doula a Fleurieux-sur-l'Arbresle | Natur' Au Feminin",
    description:
      "Naturopathe dans l'Ouest lyonnais, conseillere en symptothermie et doula a Fleurieux-sur-l'Arbresle. Consultations au cabinet, a domicile ou en visio.",
    keywords:
      "naturopathe ouest lyonnais, naturopathe fleurieux-sur-l'arbresle, symptothermie, doula, sante feminine, gestion du stress, accompagnement feminin",
  },
  "/qui-suis-je": {
    title: "Qui suis-je ? Naturopathe, Symptothermie & Doula | Natur' Au Feminin",
    description:
      "Decouvrez le parcours d'Audrey Martinez Bouchet, naturopathe, conseillere en symptothermie et accompagnante doula.",
    keywords:
      "audrey martinez bouchet, naturopathe, symptothermie, doula, accompagnement feminin, fleurieux-sur-l'arbresle",
  },
  "/prestations": {
    title: "Prestations: Naturopathie, Symptothermie, Doula | Natur' Au Feminin",
    description:
      "Explorez les accompagnements proposes: naturopathie, ecoute corporelle, symptothermie et doula.",
    keywords:
      "prestations naturopathie, ecoute corporelle, symptothermie, doula, accompagnement prenatal, regulation emotionnelle",
  },
  "/prestations/naturopathie": {
    title: "Naturopathie feminine a Fleurieux-sur-l'Arbresle | Natur' Au Feminin",
    description:
      "Accompagnement en naturopathie feminine pour retrouver equilibre, vitalite et mieux-etre au quotidien.",
    keywords:
      "naturopathie feminine, naturopathe fleurieux-sur-l'arbresle, equilibre hormonal, syndrome premenstruel, menopause",
  },
  "/prestations/ecoute-corporelle": {
    title: "Ecoute corporelle & regulation emotionnelle | Natur' Au Feminin",
    description:
      "L'ecoute corporelle par la Voie des Sens pour apaiser la charge emotionnelle et retrouver un ancrage durable.",
    keywords:
      "ecoute corporelle, regulation emotionnelle, gestion du stress, accompagnement emotionnel, la voie des sens",
  },
  "/prestations/symptothermie": {
    title: "Symptothermie: comprendre son cycle feminin | Natur' Au Feminin",
    description:
      "Apprenez a comprendre votre cycle menstruel grace a la symptothermie pour contraception naturelle ou projet de conception.",
    keywords:
      "symptothermie, cycle feminin, fertilite naturelle, contraception naturelle, conception, sante menstruelle",
  },
  "/prestations/doula": {
    title: "Doula: preconception, grossesse & post-partum | Natur' Au Feminin",
    description:
      "Accompagnement doula en preconception, grossesse et post-partum avec une approche humaine et personnalisee.",
    keywords:
      "doula, accompagnement grossesse, post-partum, preconception, allaitement, accompagnement prenatal",
  },
  "/tarifs": {
    title: "Tarifs naturopathie, symptothermie & doula | Natur' Au Feminin",
    description:
      "Consultez les tarifs des accompagnements en symptothermie, naturopathie, doula et massages.",
    keywords:
      "tarifs naturopathie, prix symptothermie, tarifs doula, massage femme enceinte, massage bebe",
  },
  "/actualites": {
    title: "Actualites, ateliers et evenements | Natur' Au Feminin",
    description: "Retrouvez les ateliers, evenements et actualites de Natur' Au Feminin.",
    keywords:
      "actualites naturopathie, ateliers cycle menstruel, evenements sante feminine, fleurieux-sur-l'arbresle",
  },
  "/mon-cercle": {
    title: "Mon cercle: partenaires sante feminine | Natur' Au Feminin",
    description:
      "Decouvrez mon cercle de partenaires de confiance pour un accompagnement complementaire autour de la sante feminine.",
    keywords:
      "partenaires sante feminine, reseau bien-etre feminin, accompagnement global, fleurieux-sur-l'arbresle",
  },
  "/contact": {
    title: "Contact & rendez-vous | Natur' Au Feminin",
    description:
      "Prenez contact pour reserver un accompagnement en naturopathie, symptothermie ou doula.",
    keywords:
      "contact naturopathe, rendez-vous symptothermie, rendez-vous doula, fleurieux-sur-l'arbresle, visio",
  },
  "/zones-desservies": {
    title: "Zones desservies: Fleurieux, Ouest Lyonnais, Rhône, France | Natur' Au Feminin",
    description:
      "Accompagnements en cabinet a Fleurieux-sur-l'Arbresle, a domicile autour de L'Arbresle et en visio partout en France.",
    keywords:
      "naturopathe l'arbresle, naturopathe lentilly, naturopathe lozanne, doula ouest lyonnais, symptothermie rhone, visio france",
  },
  "/ouest-lyonnais": {
    title: "Naturopathe Ouest Lyonnais: consultations cabinet, domicile et visio | Natur' Au Feminin",
    description:
      "Accompagnement en naturopathie, symptothermie et doula dans l'Ouest lyonnais: Fleurieux-sur-l'Arbresle, L'Arbresle, Lentilly, Lozanne et communes voisines.",
    keywords:
      "naturopathe ouest lyonnais, doula ouest lyonnais, symptothermie ouest lyonnais, naturopathe lentilly, naturopathe lozanne, naturopathe l'arbresle",
  },
  "/mentions-legales": {
    title: "Mentions legales | Natur' Au Feminin",
    description: "Consultez les mentions legales du site Natur' Au Feminin.",
    keywords: "mentions legales, natur au feminin",
  },
  "/politique-de-confidentialite": {
    title: "Politique de confidentialite | Natur' Au Feminin",
    description:
      "Consultez la politique de confidentialite et la gestion des donnees personnelles de Natur' Au Feminin.",
    keywords: "politique de confidentialite, donnees personnelles, natur au feminin",
  },
};

export function getDefaultPageSeo(pathname: string): DefaultPageSeo {
  return (
    defaultPageSeoByPath[pathname] ?? {
      title: siteConfig.title,
      description: siteConfig.description,
      keywords:
        "naturopathie feminine, symptothermie, doula, sante feminine, fleurieux-sur-l'arbresle, ouest lyonnais, rhone",
    }
  );
}

export function getDefaultPageTitle(pathname: string): string {
  return getDefaultPageSeo(pathname).title;
}

export function getDefaultPageDescription(pathname: string): string {
  return getDefaultPageSeo(pathname).description;
}

export function getDefaultPageKeywords(pathname: string): string {
  return getDefaultPageSeo(pathname).keywords;
}
