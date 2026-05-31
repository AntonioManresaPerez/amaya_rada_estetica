import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ajustes del sitio",
  type: "document",
  groups: [
    { name: "general", title: "General" },
    { name: "contact", title: "Contacto" },
    { name: "hours", title: "Horarios" },
    { name: "media", title: "Hero" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre del centro",
      type: "string",
      group: "general",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Lema",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "description",
      title: "Descripción corta (meta description global)",
      type: "text",
      rows: 3,
      group: "general",
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: "address",
      title: "Dirección",
      type: "object",
      group: "contact",
      fields: [
        { name: "street", title: "Calle", type: "string" },
        { name: "city", title: "Ciudad", type: "string" },
        { name: "region", title: "Provincia", type: "string" },
        { name: "postalCode", title: "Código postal", type: "string" },
        { name: "country", title: "País", type: "string", initialValue: "ES" },
      ],
    }),
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp (número internacional, sin +)",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "geo",
      title: "Coordenadas",
      type: "object",
      group: "contact",
      fields: [
        { name: "latitude", title: "Latitud", type: "number" },
        { name: "longitude", title: "Longitud", type: "number" },
      ],
    }),
    defineField({
      name: "social",
      title: "Redes sociales",
      type: "object",
      group: "contact",
      fields: [
        { name: "instagram", title: "Instagram", type: "url" },
        { name: "tiktok", title: "TikTok", type: "url" },
        { name: "facebook", title: "Facebook", type: "url" },
        { name: "google", title: "Google Business", type: "url" },
      ],
    }),
    defineField({
      name: "hours",
      title: "Horarios",
      type: "array",
      group: "hours",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "day",
              title: "Día",
              type: "string",
              options: {
                list: [
                  { title: "Lunes", value: "Monday" },
                  { title: "Martes", value: "Tuesday" },
                  { title: "Miércoles", value: "Wednesday" },
                  { title: "Jueves", value: "Thursday" },
                  { title: "Viernes", value: "Friday" },
                  { title: "Sábado", value: "Saturday" },
                  { title: "Domingo", value: "Sunday" },
                ],
              },
            },
            { name: "open", title: "Apertura (HH:MM)", type: "string" },
            { name: "close", title: "Cierre (HH:MM)", type: "string" },
            { name: "closed", title: "Cerrado", type: "boolean" },
          ],
        },
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Imagen principal (hero)",
      type: "image",
      group: "media",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroVideo",
      title: "Vídeo principal (hero, MP4)",
      type: "file",
      group: "media",
      options: { accept: "video/mp4,video/webm" },
    }),
  ],
  preview: { prepare: () => ({ title: "Ajustes del sitio" }) },
});
