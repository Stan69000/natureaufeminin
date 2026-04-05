import { defineField, defineType } from "sanity";

function linkItemField(name: string, title: string) {
  return defineField({
    name,
    title,
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
          rule.uri({
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
  });
}

export const footerSettingsType = defineType({
  name: "footerSettings",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "brandPoints",
      title: "Bloc marque - points",
      description: "Exemples: Naturopathie, Symptothermie, Doula.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "contactTitle",
      title: "Titre bloc contact",
      type: "string",
      initialValue: "Contact",
    }),
    defineField({
      name: "contactItems",
      title: "Lignes contact",
      type: "array",
      of: [linkItemField("contactItem", "Ligne")],
    }),
    defineField({
      name: "accompagnementsTitle",
      title: "Titre bloc accompagnements",
      type: "string",
      initialValue: "Accompagnements",
    }),
    defineField({
      name: "accompagnements",
      title: "Liens accompagnements",
      type: "array",
      of: [linkItemField("accompagnementItem", "Lien")],
    }),
    defineField({
      name: "accompagnementsAllLabel",
      title: "Libellé lien 'voir tout'",
      type: "string",
      initialValue: "Voir toutes les prestations",
    }),
    defineField({
      name: "accompagnementsAllHref",
      title: "URL lien 'voir tout'",
      type: "url",
      validation: (rule) =>
        rule.uri({
          allowRelative: true,
          scheme: ["https"],
        }),
      initialValue: "/prestations",
    }),
    defineField({
      name: "specialitesTitle",
      title: "Titre bloc spécialités",
      type: "string",
      initialValue: "Spécialités",
    }),
    defineField({
      name: "specialites",
      title: "Liste des spécialités",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "informationsTitle",
      title: "Titre bloc informations",
      type: "string",
      initialValue: "Informations",
    }),
    defineField({
      name: "informations",
      title: "Liens informations",
      type: "array",
      of: [linkItemField("informationItem", "Lien")],
    }),
  ],
});
