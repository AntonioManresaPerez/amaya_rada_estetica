import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonio",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Texto del testimonio",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Nombre del cliente",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "service",
      title: "Servicio (texto libre)",
      type: "string",
    }),
    defineField({
      name: "rating",
      title: "Valoración (1-5)",
      type: "number",
      validation: (r) => r.min(1).max(5),
      initialValue: 5,
    }),
    defineField({ name: "image", title: "Foto (opcional)", type: "image", options: { hotspot: true } }),
    defineField({
      name: "featured",
      title: "Destacado en home",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "order", title: "Orden", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "author", subtitle: "quote" } },
});
