import { defineField, defineType } from "sanity";

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
      of: [{ type: "block" }],
      description:
        "Editeur riche recommandé pour modifier le contenu sans HTML.",
    }),
    defineField({
      name: "bodyHtml",
      title: "Contenu HTML (legacy)",
      type: "text",
      rows: 12,
      description:
        "Ancien contenu importé depuis WordPress. Laisser tel quel si vous utilisez le champ 'Contenu'.",
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
    defineField({
      name: "legacyWp",
      title: "Legacy WordPress",
      type: "object",
      fields: [
        defineField({ name: "id", title: "WP ID", type: "number" }),
        defineField({ name: "link", title: "WP Link", type: "url" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
  },
});
