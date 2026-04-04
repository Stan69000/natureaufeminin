export const siteConfig = {
  name: "Natur' Au Feminin",
  title: "Natur' Au Feminin | Naturopathie feminine, symptothermie et accompagnement doula",
  description:
    "Accompagnement en naturopathie feminine, gestion naturelle de la fertilite, regulation emotionnelle et doula. Consultations a Fleurieux-sur-l'Arbresle, a domicile ou en visio.",
  url: "https://naturaufeminin.fr",
  phone: "06 44 09 21 12",
  phoneHref: "tel:+33644092112",
  city: "Fleurieux-sur-l'Arbresle",
  bookingUrl: "https://liberlo.com/profil/audrey-martinez-bouchet/",
  adminUrl: "https://naturaufeminin-admin.sanity.studio/",
};

export const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/qui-suis-je", label: "Qui suis-je ?" },
  { href: "/prestations", label: "Prestations" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/actualites", label: "Actualités" },
  { href: "/mon-cercle", label: "Mon cercle" },
  { href: "/contact", label: "Contact" },
] as const;

export const serviceCards = [
  {
    title: "Naturopathie",
    href: "/prestations/naturopathie",
    description:
      "Retrouver un equilibre durable grace a une approche globale de votre hygiene de vie.",
  },
  {
    title: "L’écoute Corporelle par La Voie des Sens",
    href: "/prestations/ecoute-corporelle",
    description:
      "Apaiser les surcharges emotionnelles et retrouver de l'espace interieur.",
  },
  {
    title: "Symptothermie",
    href: "/prestations/symptothermie",
    description:
      "Comprendre votre cycle pour la contraception naturelle ou la conception.",
  },
  {
    title: "Doula",
    href: "/prestations/doula",
    description:
      "Un accompagnement humain autour de la preconception, grossesse et post-partum.",
  },
] as const;
