export interface CommuneSeoItem {
  name: string;
  slug: string;
  nearbyLabel: string;
  localAngle: string;
  mobilityHint: string;
  audienceNeeds: string[];
  nearbyCommunes: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

export const communeSeoItems: CommuneSeoItem[] = [
  {
    name: "Fleurieux-sur-l'Arbresle",
    slug: "fleurieux-sur-l-arbresle",
    nearbyLabel: "au cabinet",
    localAngle:
      "Le cabinet est situé à Fleurieux-sur-l'Arbresle, ce qui permet un accompagnement de proximité et un suivi simple d'une séance à l'autre.",
    mobilityHint:
      "Pour les habitantes de Fleurieux-sur-l'Arbresle, le format cabinet reste généralement le plus direct.",
    audienceNeeds: [
      "équilibre hormonal et fatigue persistante",
      "cycle menstruel irrégulier",
      "accompagnement de la préconception au post-partum",
    ],
    nearbyCommunes: ["L'Arbresle", "Éveux", "Savigny"],
    faq: [
      {
        question: "Proposez-vous surtout des rendez-vous au cabinet à Fleurieux-sur-l'Arbresle ?",
        answer:
          "Oui, la consultation au cabinet est la modalité principale pour Fleurieux-sur-l'Arbresle, avec un suivi régulier et structuré.",
      },
      {
        question: "Peut-on alterner cabinet et visio ?",
        answer:
          "Oui, c'est possible selon votre rythme et vos contraintes, afin de maintenir une continuité d'accompagnement.",
      },
    ],
  },
  {
    name: "L'Arbresle",
    slug: "l-arbresle",
    nearbyLabel: "à proximité immédiate",
    localAngle:
      "Depuis L'Arbresle, l'accès au cabinet de Fleurieux-sur-l'Arbresle est rapide, ce qui convient bien aux suivis sur plusieurs mois.",
    mobilityHint:
      "Selon votre agenda, vous pouvez privilégier cabinet + visio pour limiter les déplacements.",
    audienceNeeds: [
      "stress chronique et surcharge mentale",
      "optimisation de la fertilité naturelle",
      "accompagnement global féminin",
    ],
    nearbyCommunes: ["Fleurieux-sur-l'Arbresle", "Sain-Bel", "Lozanne"],
    faq: [
      {
        question: "L'accompagnement depuis L'Arbresle est-il adapté aux suivis réguliers ?",
        answer:
          "Oui, la proximité permet des consultations planifiées et un travail progressif en naturopathie, symptothermie ou doula.",
      },
      {
        question: "Intervenez-vous aussi à domicile à L'Arbresle ?",
        answer:
          "Oui, des rendez-vous à domicile peuvent être proposés selon disponibilités et organisation du secteur.",
      },
    ],
  },
  {
    name: "Sain-Bel",
    slug: "sain-bel",
    nearbyLabel: "dans l'Ouest lyonnais",
    localAngle:
      "À Sain-Bel, l'accompagnement se fait le plus souvent au cabinet ou en visio, avec un plan d'action concret entre les séances.",
    mobilityHint:
      "Le format hybride cabinet + visio est souvent apprécié pour garder un bon rythme sans contrainte.",
    audienceNeeds: [
      "gestion naturelle du syndrome prémenstruel",
      "fatigue, sommeil et récupération",
      "préparation à la grossesse",
    ],
    nearbyCommunes: ["L'Arbresle", "Savigny", "Fleurieux-sur-l'Arbresle"],
    faq: [
      {
        question: "Quel accompagnement recommandez-vous en premier à Sain-Bel ?",
        answer:
          "Cela dépend de votre objectif: naturopathie pour l'hygiène de vie, symptothermie pour le cycle, ou doula autour de la maternité.",
      },
      {
        question: "La visio peut-elle suffire si je suis à Sain-Bel ?",
        answer:
          "Oui, la visio fonctionne très bien pour de nombreuses situations, avec des recommandations personnalisées et un suivi clair.",
      },
    ],
  },
  {
    name: "Savigny",
    slug: "savigny",
    nearbyLabel: "dans l'Ouest lyonnais",
    localAngle:
      "Pour Savigny, l'accompagnement est conçu pour rester simple à tenir dans le quotidien: objectifs réalistes et ajustements progressifs.",
    mobilityHint:
      "Selon la période, un premier rendez-vous au cabinet peut être complété par des points de suivi en visio.",
    audienceNeeds: [
      "charge émotionnelle et régulation du stress",
      "douleurs cycliques et confort menstruel",
      "soutien post-partum",
    ],
    nearbyCommunes: ["L'Arbresle", "Sain-Bel", "Éveux"],
    faq: [
      {
        question: "Accompagnez-vous les problématiques émotionnelles à Savigny ?",
        answer:
          "Oui, notamment via l'écoute corporelle et des outils de régulation adaptés à votre niveau de charge actuel.",
      },
      {
        question: "Peut-on associer doula et naturopathie ?",
        answer:
          "Oui, ces accompagnements sont complémentaires pour soutenir à la fois le corps, l'émotionnel et l'organisation du quotidien.",
      },
    ],
  },
  {
    name: "Éveux",
    slug: "eveux",
    nearbyLabel: "à proximité de Fleurieux-sur-l'Arbresle",
    localAngle:
      "Depuis Éveux, la proximité du cabinet facilite les parcours d'accompagnement structurés sur plusieurs étapes.",
    mobilityHint:
      "Les créneaux peuvent être organisés en cabinet, avec relais en visio si nécessaire.",
    audienceNeeds: [
      "déséquilibres digestifs et hormonaux",
      "lecture du cycle en symptothermie",
      "accompagnement de grossesse",
    ],
    nearbyCommunes: ["Fleurieux-sur-l'Arbresle", "L'Arbresle", "Lentilly"],
    faq: [
      {
        question: "Travaillez-vous la symptothermie pour les femmes d'Éveux ?",
        answer:
          "Oui, avec un apprentissage progressif et des retours personnalisés pour vous rendre autonome dans la lecture du cycle.",
      },
      {
        question: "Le suivi est-il possible sur plusieurs mois ?",
        answer:
          "Oui, les accompagnements peuvent être planifiés sur la durée avec des ajustements à chaque étape.",
      },
    ],
  },
  {
    name: "Lentilly",
    slug: "lentilly",
    nearbyLabel: "dans le Rhône",
    localAngle:
      "À Lentilly, de nombreuses femmes recherchent un accompagnement complet entre santé féminine, cycle et équilibre de vie.",
    mobilityHint:
      "Selon vos contraintes, le suivi peut se construire avec une base en visio et des rendez-vous ponctuels au cabinet.",
    audienceNeeds: [
      "fatigue hormonale et baisse d'énergie",
      "arrêt de contraception et compréhension du cycle",
      "préparation à la conception",
    ],
    nearbyCommunes: ["Lozanne", "Éveux", "Fleurieux-sur-l'Arbresle"],
    faq: [
      {
        question: "L'accompagnement en visio est-il pertinent depuis Lentilly ?",
        answer:
          "Oui, la visio permet un suivi régulier et efficace, notamment en naturopathie et symptothermie.",
      },
      {
        question: "Faites-vous aussi des accompagnements doula pour Lentilly ?",
        answer:
          "Oui, en préconception, grossesse et post-partum, avec un cadre personnalisé selon votre situation.",
      },
    ],
  },
  {
    name: "Lozanne",
    slug: "lozanne",
    nearbyLabel: "dans le Rhône",
    localAngle:
      "Pour Lozanne, l'objectif est d'apporter un accompagnement lisible, concret et compatible avec les rythmes professionnels et familiaux.",
    mobilityHint:
      "Le suivi mixte cabinet/visio est souvent une bonne option pour garder de la régularité.",
    audienceNeeds: [
      "stress, sommeil et récupération nerveuse",
      "symptômes prémenstruels",
      "accompagnement du post-partum",
    ],
    nearbyCommunes: ["Lentilly", "L'Arbresle", "Fleurieux-sur-l'Arbresle"],
    faq: [
      {
        question: "Accompagnez-vous les cycles irréguliers depuis Lozanne ?",
        answer:
          "Oui, l'accompagnement combine hygiène de vie, compréhension du cycle et suivi personnalisé selon vos objectifs.",
      },
      {
        question: "Combien de séances prévoir en moyenne ?",
        answer:
          "Le rythme est individualisé, mais un suivi sur plusieurs séances est souvent nécessaire pour un changement durable.",
      },
    ],
  },
  {
    name: "Chessy-les-Mines",
    slug: "chessy-les-mines",
    nearbyLabel: "dans le secteur de L'Arbresle",
    localAngle:
      "À Chessy-les-Mines, l'accompagnement vise un équilibre global: alimentation, cycle, stress et soutien émotionnel.",
    mobilityHint:
      "Vous pouvez démarrer en visio puis ajuster vers le cabinet selon vos besoins.",
    audienceNeeds: [
      "troubles du cycle et inconfort hormonal",
      "besoin de cadre et de régularité dans l'hygiène de vie",
      "soutien autour de la maternité",
    ],
    nearbyCommunes: ["L'Arbresle", "Sain-Bel", "Fleurieux-sur-l'Arbresle"],
    faq: [
      {
        question: "Le cabinet est-il facilement accessible depuis Chessy-les-Mines ?",
        answer:
          "Oui, le cabinet de Fleurieux-sur-l'Arbresle reste une option pratique pour un suivi en présentiel.",
      },
      {
        question: "Peut-on commencer l'accompagnement à distance ?",
        answer:
          "Oui, un démarrage en visio est possible puis le format peut évoluer selon vos préférences.",
      },
    ],
  },
];
