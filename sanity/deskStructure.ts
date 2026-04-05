import type { StructureResolver } from "sanity/structure";

const LEGAL_SLUGS = ["mentions-legales", "politique-de-confidentialite"];

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Contenus")
    .items([
      S.listItem()
        .title("Footer")
        .child(
          S.document()
            .schemaType("footerSettings")
            .documentId("footerSettings"),
        ),
      S.listItem()
        .title("Pages légales")
        .child(
          S.documentTypeList("page")
            .title("Pages légales")
            .filter('_type == "page" && slug.current in $legalSlugs')
            .params({ legalSlugs: LEGAL_SLUGS }),
        ),
      S.listItem()
        .title("Pages du site")
        .child(
          S.documentTypeList("page")
            .title("Pages du site")
            .filter('_type == "page" && !(slug.current in $legalSlugs)')
            .params({ legalSlugs: LEGAL_SLUGS }),
        ),
    ]);
