import { defineField, defineType } from "sanity";

export const promoPack = defineType({
  name: "promoPack",
  title: "Bono / Tarjeta regalo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Bono de sesiones", value: "bono" },
          { title: "Pack de tratamientos", value: "pack" },
          { title: "Tarjeta regalo", value: "tarjeta-regalo" },
        ],
        layout: "radio",
      },
      initialValue: "bono",
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "sessions",
      title: "Nº de sesiones (opcional)",
      type: "number",
    }),
    defineField({
      name: "price",
      title: "Precio (€)",
      type: "number",
    }),
    defineField({
      name: "originalPrice",
      title: "Precio sin descuento (€, opcional — se muestra tachado)",
      type: "number",
    }),
    defineField({
      name: "badge",
      title: "Etiqueta (opcional, p. ej. «Más popular»)",
      type: "string",
    }),
    defineField({
      name: "featured",
      title: "Destacar",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "active",
      title: "Activo (visible cuando la sección está encendida)",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "order", title: "Orden", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "title", price: "price", kind: "kind" },
    prepare: ({ title, price, kind }) => ({
      title,
      subtitle: [kind, price ? `${price}€` : null].filter(Boolean).join(" · "),
    }),
  },
});
