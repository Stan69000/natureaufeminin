export const siteConfig = {
  name: "Natur' Au Feminin",
  title: "Natur' Au Feminin | Naturopathie feminine, symptothermie et accompagnement doula",
  description:
    "Accompagnement en naturopathie feminine, gestion naturelle de la fertilite, regulation emotionnelle et doula. Consultations a Fleurieux-sur-l'Arbresle, a domicile ou en visio.",
  url: "https://naturaufeminin.fr",
  phone: "06 44 09 21 12",
  phoneHref: "tel:+33644092112",
  city: "Fleurieux-sur-l'Arbresle",
  // Adresse normalisee selon la Base Adresse Nationale (api-adresse.data.gouv.fr).
  // A reporter a l'identique sur la fiche Google Business : la coherence NAP
  // (nom / adresse / telephone) entre le site et la fiche est un signal local.
  streetAddress: "37 place des Deux Chouettes",
  postalCode: "69210",
  region: "Auvergne-Rhone-Alpes",
  latitude: 45.835608,
  longitude: 4.651224,
  priceRange: "\u20AC\u20AC",
  bookingUrl: "https://liberlo.com/profil/audrey-martinez-bouchet/",
  adminUrl: "https://admin.stan-bouchet.fr/",
};

export const serviceAreas = {
  localCommunes: [
    "Fleurieux-sur-l'Arbresle",
    "L'Arbresle",
    "Sain-Bel",
    "Savigny",
    "Éveux",
    "Lentilly",
    "Lozanne",
    "Chessy-les-Mines",
  ],
  regionalAreas: ["Ouest lyonnais", "Rhône", "Métropole de Lyon"],
  nationalLabel: "Visio partout en France",
} as const;

export const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/qui-suis-je/", label: "Qui suis-je ?" },
  { href: "/prestations/", label: "Prestations" },
  { href: "/tarifs/", label: "Tarifs" },
  { href: "/actualites/", label: "Actualités" },
  { href: "/mon-cercle/", label: "Mon cercle" },
  { href: "/contact/", label: "Contact" },
] as const;

export const serviceCards = [
  {
    title: "Naturopathie",
    href: "/prestations/naturopathie/",
    description:
      "Retrouver un equilibre durable grace a une approche globale de votre hygiene de vie.",
  },
  {
    title: "L’écoute Corporelle par La Voie des Sens",
    href: "/prestations/ecoute-corporelle/",
    description:
      "Apaiser les surcharges emotionnelles et retrouver de l'espace interieur.",
  },
  {
    title: "Symptothermie",
    href: "/prestations/symptothermie/",
    description:
      "Comprendre votre cycle pour la contraception naturelle ou la conception.",
  },
  {
    title: "Doula",
    href: "/prestations/doula/",
    description:
      "Un accompagnement humain autour de la preconception, grossesse et post-partum.",
  },
] as const;
