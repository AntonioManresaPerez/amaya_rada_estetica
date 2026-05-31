import { defineField, defineType } from "sanity";

export const beforeAfter = defineType({
  name: "beforeAfter",
  title: "Antes / Después",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título interno", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "service",
      title: "Servicio relacionado",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({
      name: "beforeImage",
      title: "Foto ANTES",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "afterImage",
      title: "Foto DESPUÉS",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sessions",
      title: "Nº de sesiones",
      type: "number",
    }),
    defineField({ name: "notes", title: "Notas / descripción pública", type: "text", rows: 3 }),
    defineField({
      name: "consentSigned",
      title: "Consentimiento firmado por el/la cliente",
      type: "boolean",
      description: "Imprescindible para publicar. Sin esto la imagen no aparece en la web.",
      initialValue: false,
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Orden", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "title", media: "afterImage", subtitle: "service.title" },
  },
});
