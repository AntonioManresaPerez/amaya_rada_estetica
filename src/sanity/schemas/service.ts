import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Servicio",
  type: "document",
  groups: [
    { name: "content", title: "Contenido" },
    { name: "pricing", title: "Precio y duración" },
    { name: "media", title: "Multimedia" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nombre del servicio",
      type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "serviceCategory" }],
      group: "content",
    }),
    defineField({
      name: "shortDescription",
      title: "Descripción corta",
      type: "text",
      rows: 3,
      group: "content",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "longDescription",
      title: "Descripción detallada",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
    }),
    defineField({
      name: "benefits",
      title: "Beneficios",
      type: "array",
      of: [{ type: "string" }],
      group: "content",
    }),
    defineField({
      name: "process",
      title: "Cómo es la sesión (pasos)",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Título del paso", type: "string" },
            { name: "description", title: "Descripción", type: "text", rows: 2 },
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    defineField({
      name: "contraindications",
      title: "Contraindicaciones",
      type: "array",
      of: [{ type: "string" }],
      group: "content",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Pregunta", type: "string" },
            { name: "answer", title: "Respuesta", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "duration",
      title: "Duración (minutos)",
      type: "number",
      group: "pricing",
    }),
    defineField({
      name: "price",
      title: "Precio (€)",
      type: "number",
      group: "pricing",
    }),
    defineField({
      name: "image",
      title: "Imagen principal",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Texto alternativo", type: "string" }],
    }),
    defineField({
      name: "gallery",
      title: "Galería",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "featured",
      title: "Destacado en home",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "order", title: "Orden", type: "number", initialValue: 0 }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        { name: "title", title: "Título SEO", type: "string" },
        { name: "description", title: "Meta description", type: "text", rows: 2 },
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "image", subtitle: "category.title" },
  },
});
