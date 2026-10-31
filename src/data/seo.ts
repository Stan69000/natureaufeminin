import { siteConfig } from "./site";

interface DefaultPageSeo {
  title: string;
  description: string;
  keywords: string;
}

const defaultPageSeoByPath: Record<string, DefaultPageSeo> = {
  "/": {
    title: "Naturopathe à Fleurieux-sur-l'Arbresle | Natur' Au Feminin",
    description:
      "Naturopathe, conseillère en symptothermie et doula à Fleurieux-sur-l'Arbresle. Consultations au cabinet, à domicile ou en visio partout en France.",
    keywords:
      "naturopathe ouest lyonnais, naturopathe fleurieux-sur-l'arbresle, symptothermie, doula, santé féminine, ménopause, accompagnement féminin",
  },
  "/qui-suis-je": {
    title: "Qui suis-je ? Audrey Martinez Bouchet, naturopathe & doula",
    description:
      "Le parcours d'Audrey Martinez Bouchet : naturopathe, conseillère en symptothermie et accompagnante doula dans l'Ouest lyonnais.",
    keywords:
      "audrey martinez bouchet, naturopathe, symptothermie, doula, accompagnement féminin, fleurieux-sur-l'arbresle",
  },
  "/prestations": {
    title: "Prestations : naturopathie, symptothermie & doula",
    description:
      "Naturopathie féminine, écoute corporelle, symptothermie et accompagnement doula : les quatre accompagnements proposés au cabinet ou en visio.",
    keywords:
      "prestations naturopathie, écoute corporelle, symptothermie, doula, accompagnement prénatal, régulation émotionnelle",
  },
  "/prestations/naturopathie": {
    title: "Naturopathie féminine à Fleurieux-sur-l'Arbresle",
    description:
      "Accompagnement en naturopathie féminine pour retrouver équilibre, vitalité et mieux-être au quotidien. Cabinet, domicile ou visio.",
    keywords:
      "naturopathie féminine, naturopathe fleurieux-sur-l'arbresle, équilibre hormonal, syndrome prémenstruel, ménopause",
  },
  "/prestations/ecoute-corporelle": {
    title: "Écoute corporelle & régulation émotionnelle",
    description:
      "L'écoute corporelle par la Voie des Sens pour apaiser la charge émotionnelle et retrouver un ancrage durable.",
    keywords:
      "écoute corporelle, régulation émotionnelle, gestion du stress, accompagnement émotionnel, la voie des sens",
  },
  "/prestations/symptothermie": {
    title: "Symptothermie : comprendre son cycle féminin",
    description:
      "Apprenez à lire votre cycle menstruel grâce à la symptothermie, pour une contraception naturelle ou un projet de conception.",
    keywords:
      "symptothermie, cycle féminin, fertilité naturelle, contraception naturelle, conception, santé menstruelle",
  },
  "/prestations/doula": {
    title: "Doula : préconception, grossesse & post-partum",
    description:
      "Accompagnement doula en préconception, grossesse et post-partum, avec une approche humaine et personnalisée.",
    keywords:
      "doula, accompagnement grossesse, post-partum, préconception, allaitement, accompagnement prénatal",
  },
  "/tarifs": {
    title: "Tarifs : naturopathie, symptothermie & doula",
    description:
      "Les tarifs des accompagnements en naturopathie, symptothermie, doula, massage ayurvédique et massage bébé.",
    keywords:
      "tarifs naturopathie, prix symptothermie, tarifs doula, massage femme enceinte, massage bébé",
  },
  "/actualites": {
    title: "Actualités, ateliers et évènements | Natur' Au Feminin",
    description:
      "Les prochaines dates, ateliers et annonces de Natur' Au Feminin, à Fleurieux-sur-l'Arbresle et en ligne.",
    keywords:
      "actualités naturopathie, ateliers cycle menstruel, évènements santé féminine, fleurieux-sur-l'arbresle",
  },
  "/mon-cercle": {
    title: "Mon cercle : partenaires en santé féminine",
    description:
      "Les partenaires de confiance avec qui je travaille pour un accompagnement complémentaire autour de la santé féminine.",
    keywords:
      "partenaires santé féminine, réseau bien-être féminin, accompagnement global, fleurieux-sur-l'arbresle",
  },
  "/contact": {
    title: "Contact & prise de rendez-vous | Natur' Au Feminin",
    description:
      "Réservez un accompagnement en naturopathie, symptothermie ou doula, au cabinet de Fleurieux-sur-l'Arbresle ou en visio.",
    keywords:
      "contact naturopathe, rendez-vous symptothermie, rendez-vous doula, fleurieux-sur-l'arbresle, visio",
  },
  "/zones-desservies": {
    title: "Zones desservies : Ouest lyonnais, Rhône et visio",
    description:
      "Cabinet à Fleurieux-sur-l'Arbresle, déplacements à domicile autour de L'Arbresle et consultations en visio partout en France.",
    keywords:
      "naturopathe l'arbresle, naturopathe lentilly, naturopathe lozanne, doula ouest lyonnais, symptothermie rhône, visio france",
  },
  "/ouest-lyonnais": {
    title: "Naturopathe dans l'Ouest lyonnais | Natur' Au Feminin",
    description:
      "Naturopathie, symptothermie et doula dans l'Ouest lyonnais : Fleurieux-sur-l'Arbresle, L'Arbresle, Lentilly, Lozanne et communes voisines.",
    keywords:
      "naturopathe ouest lyonnais, doula ouest lyonnais, symptothermie ouest lyonnais, naturopathe lentilly, naturopathe lozanne, naturopathe l'arbresle",
  },
  "/menopause": {
    title: "Naturopathie et ménopause | Natur' Au Feminin",
    description:
      "Accompagnement en naturopathie pendant la préménopause et la ménopause : hygiène de vie, sommeil, stress et émotions. Cabinet, domicile ou visio.",
    keywords:
      "naturopathe ménopause, naturopathie ménopause, préménopause, bouffées de chaleur, sommeil, ouest lyonnais, fleurieux-sur-l'arbresle",
  },
  "/mentions-legales": {
    title: "Mentions légales | Natur' Au Feminin",
    description:
      "Les mentions légales du site Natur' Au Feminin.",
    keywords:
      "mentions légales, natur au feminin",
  },
  "/politique-de-confidentialite": {
    title: "Politique de confidentialité | Natur' Au Feminin",
    description:
      "La politique de confidentialité et la gestion des données personnelles de Natur' Au Feminin.",
    keywords:
      "politique de confidentialité, données personnelles, natur au feminin",
  },
};

export function getDefaultPageSeo(pathname: string): DefaultPageSeo {
  // Depuis trailingSlash: 'always', Astro.url.pathname se termine par "/"
  // alors que les cles de defaultPageSeoByPath n'en ont pas : sans cette
  // normalisation, toute recherche par pathname retomberait sur le defaut.
  const key = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return (
    defaultPageSeoByPath[key] ?? {
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

// Conserve a titre documentaire : la balise meta keywords n'est plus emise
// (Google l'ignore depuis 2009), mais ce champ garde trace des requetes
// visees par chaque page.
export function getDefaultPageKeywords(pathname: string): string {
  return getDefaultPageSeo(pathname).keywords;
}
