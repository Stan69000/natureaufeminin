export interface CommuneSeoItem {
  name: string;
  slug: string;
  nearbyLabel?: string;
}

export const communeSeoItems: CommuneSeoItem[] = [
  { name: "Fleurieux-sur-l'Arbresle", slug: "fleurieux-sur-l-arbresle", nearbyLabel: "au cabinet" },
  { name: "L'Arbresle", slug: "l-arbresle", nearbyLabel: "à proximité immédiate" },
  { name: "Sain-Bel", slug: "sain-bel", nearbyLabel: "dans l'Ouest lyonnais" },
  { name: "Savigny", slug: "savigny", nearbyLabel: "dans l'Ouest lyonnais" },
  { name: "Éveux", slug: "eveux", nearbyLabel: "à proximité de Fleurieux-sur-l'Arbresle" },
  { name: "Lentilly", slug: "lentilly", nearbyLabel: "dans le Rhône" },
  { name: "Lozanne", slug: "lozanne", nearbyLabel: "dans le Rhône" },
  { name: "Chessy-les-Mines", slug: "chessy-les-mines", nearbyLabel: "dans le secteur de L'Arbresle" },
];
