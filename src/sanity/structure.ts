import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Ajustes del sitio")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.divider(),
      S.documentTypeListItem("service").title("Servicios"),
      S.documentTypeListItem("serviceCategory").title("Categorías de servicio"),
      S.divider(),
      S.documentTypeListItem("beforeAfter").title("Galería antes/después"),
      S.documentTypeListItem("testimonial").title("Testimonios"),
      S.divider(),
      S.documentTypeListItem("post").title("Blog"),
      S.documentTypeListItem("author").title("Autores"),
    ]);
