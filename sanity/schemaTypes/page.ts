import { defineField, defineType } from "sanity";

function getDocumentSlug(document: unknown): string {
  const candidate = document as { slug?: { current?: string } } | null | undefined;
  return candidate?.slug?.current ?? "";
}

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "array",
      of: [
        { type: "block" },
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texte alternatif",
              type: "string",
              description: "Décrivez l’image pour l’accessibilité et le SEO.",
            }),
          ],
        }),
        defineField({
          name: "youtubeEmbed",
          title: "YouTube",
          type: "object",
          fields: [
            defineField({
              name: "url",
              title: "URL YouTube",
              type: "url",
              description: "Lien YouTube (watch, youtu.be, shorts...).",
            }),
            defineField({
              name: "videoId",
              title: "ID vidéo",
              type: "string",
              description: "Optionnel si l'URL est renseignée.",
            }),
            defineField({
              name: "title",
              title: "Titre accessibilité",
              type: "string",
              initialValue: "Vidéo YouTube",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "url",
            },
            prepare(selection) {
              return {
                title: selection.title || "Bloc YouTube",
                subtitle: selection.subtitle || "Sans URL",
              };
            },
          },
        }),
        defineField({
          name: "ctaButton",
          title: "Bouton CTA",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Texte bouton",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({
                  allowRelative: true,
                  scheme: ["https", "mailto", "tel"],
                }),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "href",
            },
          },
        }),
      ],
      description:
        "Editeur riche recommandé pour modifier le contenu sans HTML.",
      hidden: ({ document }) => getDocumentSlug(document) === "tarifs",
    }),
    defineField({
      name: "pricingSections",
      title: "Tarifs (sections texte)",
      type: "array",
      description:
        "Pour la page Tarifs : sections éditables sans image (titre + lignes).",
      hidden: ({ document }) => getDocumentSlug(document) !== "tarifs",
      of: [
        defineField({
          name: "pricingSection",
          title: "Section",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Titre",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              title: "Lignes",
              type: "array",
              of: [
                defineField({
                  name: "pricingItem",
                  title: "Ligne",
                  type: "object",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Libellé",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "price",
                      title: "Prix",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      title: "label",
                      subtitle: "price",
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "items.0.label",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "pricingIntro",
      title: "Intro tarifs",
      type: "text",
      rows: 3,
      description: "Texte d’introduction affiché en haut de la page Tarifs.",
      hidden: ({ document }) => getDocumentSlug(document) !== "tarifs",
    }),
    defineField({
      name: "pricingCtaText",
      title: "Texte CTA tarifs",
      type: "string",
      description: "Question affichée à droite du bloc final des tarifs.",
      hidden: ({ document }) => getDocumentSlug(document) !== "tarifs",
    }),
    defineField({
      name: "pricingCtaLabel",
      title: "Libellé lien CTA tarifs",
      type: "string",
      description: "Texte du lien du CTA tarifs.",
      hidden: ({ document }) => getDocumentSlug(document) !== "tarifs",
    }),
    defineField({
      name: "pricingCtaUrl",
      title: "URL CTA tarifs",
      type: "url",
      description: "Lien du CTA tarifs.",
      hidden: ({ document }) => getDocumentSlug(document) !== "tarifs",
    }),
    defineField({
      name: "prestationsMenuTitle",
      title: "Titre sous-menu prestations",
      type: "string",
      hidden: ({ document }) => getDocumentSlug(document) !== "prestations",
    }),
    defineField({
      name: "prestationsIntro",
      title: "Intro prestations",
      type: "text",
      rows: 3,
      hidden: ({ document }) => getDocumentSlug(document) !== "prestations",
    }),
    defineField({
      name: "prestationsMenu",
      title: "Sous-menu prestations",
      type: "array",
      description: "Liens rapides vers les pages de prestations.",
      hidden: ({ document }) => getDocumentSlug(document) !== "prestations",
      of: [
        defineField({
          name: "prestationsMenuItem",
          title: "Lien",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Libellé",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({
                  allowRelative: true,
                  scheme: ["https"],
                }),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "href",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "actualitesIntro",
      title: "Intro actualités",
      type: "text",
      rows: 3,
      hidden: ({ document }) => getDocumentSlug(document) !== "que-se-passe-t-il-en-ce-moment",
    }),
    defineField({
      name: "actualitesItems",
      title: "Articles actualités",
      type: "array",
      description: "Publiez des news sans image, avec vidéo YouTube optionnelle.",
      hidden: ({ document }) => getDocumentSlug(document) !== "que-se-passe-t-il-en-ce-moment",
      of: [
        defineField({
          name: "actualiteItem",
          title: "Article",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Titre",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "publishedAt",
              title: "Date",
              type: "datetime",
            }),
            defineField({
              name: "excerpt",
              title: "Texte",
              type: "text",
              rows: 6,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "youtubeUrl",
              title: "URL YouTube",
              type: "url",
              description: "Collez un lien YouTube (watch, youtu.be, shorts...).",
            }),
            defineField({
              name: "ctaLabel",
              title: "Libellé CTA",
              type: "string",
            }),
            defineField({
              name: "ctaUrl",
              title: "URL CTA",
              type: "url",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "publishedAt",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "actualitesFeaturedTitle",
      title: "Actu mise en avant - titre",
      type: "string",
      hidden: ({ document }) => getDocumentSlug(document) !== "que-se-passe-t-il-en-ce-moment",
    }),
    defineField({
      name: "actualitesFeaturedPublishedAt",
      title: "Actu mise en avant - date",
      type: "date",
      hidden: ({ document }) => getDocumentSlug(document) !== "que-se-passe-t-il-en-ce-moment",
    }),
    defineField({
      name: "actualitesFeaturedExcerpt",
      title: "Actu mise en avant - texte",
      type: "text",
      rows: 5,
      hidden: ({ document }) => getDocumentSlug(document) !== "que-se-passe-t-il-en-ce-moment",
    }),
    defineField({
      name: "circleIntro",
      title: "Intro mon cercle",
      type: "text",
      rows: 4,
      hidden: ({ document }) => getDocumentSlug(document) !== "mon-cercle",
    }),
    defineField({
      name: "circlePartners",
      title: "Partenaires du cercle",
      type: "array",
      description: "Personnes et liens à mettre en valeur sur la page Mon cercle.",
      hidden: ({ document }) => getDocumentSlug(document) !== "mon-cercle",
      of: [
        defineField({
          name: "circlePartnerItem",
          title: "Partenaire",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Nom",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              title: "Rôle / activité",
              type: "string",
            }),
            defineField({
              name: "websiteUrl",
              title: "Site web",
              type: "url",
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "role",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
  },
});
