import { siteConfig } from "./site";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface InternalLinkItem {
  href: string;
  label: string;
}

export interface PrestationSeoData {
  path: string;
  serviceName: string;
  serviceType: string;
  description: string;
  faqItems: FaqItem[];
  internalLinks: InternalLinkItem[];
}

const PRESTATION_SEO_BY_PATH: Record<string, PrestationSeoData> = {
  "/prestations/naturopathie": {
    path: "/prestations/naturopathie",
    serviceName: "Accompagnement en naturopathie féminine",
    serviceType: "Naturopathie",
    description:
      "Bilan d'hygiène de vie et accompagnement personnalisé pour améliorer l'énergie, l'équilibre hormonal et le confort global.",
    faqItems: [
      {
        question: "À qui s'adresse un accompagnement en naturopathie ?",
        answer:
          "L'accompagnement s'adresse aux femmes qui souhaitent améliorer leur hygiène de vie, leur énergie et leur équilibre au quotidien.",
      },
      {
        question: "Combien de séances sont généralement nécessaires ?",
        answer:
          "Le nombre de séances varie selon vos objectifs. Un premier bilan permet de définir un rythme réaliste et adapté.",
      },
      {
        question: "Les consultations peuvent-elles se faire à distance ?",
        answer:
          "Oui, les consultations peuvent être réalisées au cabinet, à domicile selon disponibilité ou en visio.",
      },
    ],
    internalLinks: [
      { href: "/prestations/symptothermie", label: "Découvrir la symptothermie" },
      { href: "/prestations/doula", label: "Découvrir l'accompagnement doula" },
      { href: "/prestations/ecoute-corporelle", label: "Découvrir l'écoute corporelle" },
    ],
  },
  "/prestations/symptothermie": {
    path: "/prestations/symptothermie",
    serviceName: "Accompagnement en symptothermie",
    serviceType: "Symptothermie",
    description:
      "Apprentissage de la lecture du cycle menstruel pour contraception naturelle, conception et meilleure compréhension de sa fertilité.",
    faqItems: [
      {
        question: "La symptothermie est-elle fiable ?",
        answer:
          "La méthode est rigoureuse lorsqu'elle est correctement apprise et appliquée. L'accompagnement permet de sécuriser cette mise en pratique.",
      },
      {
        question: "Peut-on utiliser la symptothermie pour concevoir ?",
        answer:
          "Oui, elle permet d'identifier précisément la fenêtre fertile, utile en projet de conception comme en contraception naturelle.",
      },
      {
        question: "Combien de temps faut-il pour devenir autonome ?",
        answer:
          "L'autonomie se construit progressivement avec l'apprentissage des observations et un suivi sur plusieurs cycles.",
      },
    ],
    internalLinks: [
      { href: "/prestations/naturopathie", label: "Découvrir la naturopathie" },
      { href: "/prestations/doula", label: "Découvrir l'accompagnement doula" },
      { href: "/prestations/ecoute-corporelle", label: "Découvrir l'écoute corporelle" },
    ],
  },
  "/prestations/doula": {
    path: "/prestations/doula",
    serviceName: "Accompagnement doula",
    serviceType: "Doula",
    description:
      "Soutien émotionnel et pratique en préconception, grossesse et post-partum pour vivre chaque étape avec plus de sérénité.",
    faqItems: [
      {
        question: "Quel est le rôle d'une doula ?",
        answer:
          "La doula offre un soutien émotionnel, informatif et pratique tout au long du parcours, en complément du suivi médical.",
      },
      {
        question: "Intervenez-vous uniquement pendant la grossesse ?",
        answer:
          "Non, l'accompagnement peut commencer en préconception et se poursuivre pendant le post-partum selon vos besoins.",
      },
      {
        question: "L'accompagnement doula remplace-t-il un suivi médical ?",
        answer:
          "Non, il ne remplace pas les professionnels de santé. Il vient en complément pour soutenir votre vécu et vos choix.",
      },
    ],
    internalLinks: [
      { href: "/prestations/naturopathie", label: "Découvrir la naturopathie" },
      { href: "/prestations/symptothermie", label: "Découvrir la symptothermie" },
      { href: "/prestations/ecoute-corporelle", label: "Découvrir l'écoute corporelle" },
    ],
  },
  "/prestations/ecoute-corporelle": {
    path: "/prestations/ecoute-corporelle",
    serviceName: "Accompagnement en écoute corporelle",
    serviceType: "Régulation émotionnelle",
    description:
      "Approche corporelle pour apaiser les surcharges émotionnelles, retrouver de l'espace intérieur et gagner en stabilité.",
    faqItems: [
      {
        question: "Que permet l'écoute corporelle ?",
        answer:
          "Elle permet d'apaiser l'intensité émotionnelle et de retrouver plus de disponibilité mentale et corporelle.",
      },
      {
        question: "Combien de séances faut-il prévoir ?",
        answer:
          "Un premier entretien permet d'évaluer la situation et de définir un nombre de séances adapté à vos besoins.",
      },
      {
        question: "Cette approche peut-elle compléter un autre accompagnement ?",
        answer:
          "Oui, elle se combine très bien avec une démarche naturopathique, un accompagnement doula ou un travail autour du cycle.",
      },
    ],
    internalLinks: [
      { href: "/prestations/naturopathie", label: "Découvrir la naturopathie" },
      { href: "/prestations/symptothermie", label: "Découvrir la symptothermie" },
      { href: "/prestations/doula", label: "Découvrir l'accompagnement doula" },
    ],
  },
};

function buildStructuredData(input: PrestationSeoData): Record<string, unknown>[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: input.serviceName,
      serviceType: input.serviceType,
      description: input.description,
      url: new URL(input.path, siteConfig.url).toString(),
      areaServed: "France",
      availableChannel: [
        { "@type": "ServiceChannel", serviceLocation: { "@type": "Place", name: siteConfig.city } },
        { "@type": "ServiceChannel", serviceUrl: siteConfig.bookingUrl },
      ],
      provider: {
        "@type": "ProfessionalService",
        name: siteConfig.name,
        url: siteConfig.url,
        telephone: siteConfig.phone,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: input.faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}

export function getPrestationSeo(path: string): PrestationSeoData & { structuredData: Record<string, unknown>[] } {
  const result = PRESTATION_SEO_BY_PATH[path];
  if (!result) {
    throw new Error(`Unknown prestation SEO path "${path}"`);
  }
  return {
    ...result,
    structuredData: buildStructuredData(result),
  };
}
