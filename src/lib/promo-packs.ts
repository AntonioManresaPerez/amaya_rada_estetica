import type { SanityPromoPack } from "@/types/sanity";

// Packs/bonos por defecto (fallback). Se usan cuando aún no hay bonos creados
// en Sanity. Son ejemplos realistas y editables: crea o edita "Bonos y tarjetas
// regalo" en Sanity Studio para sustituirlos por los tuyos.
export const DEFAULT_PROMO_PACKS: SanityPromoPack[] = [
  {
    _id: "default-rf-facial-5",
    title: "Bono 5 sesiones · Radiofrecuencia facial",
    kind: "bono",
    sessions: 5,
    price: 199,
    originalPrice: 250,
    badge: "Más popular",
    featured: true,
    description:
      "Reafirma, alisa y rejuvenece con un plan completo de radiofrecuencia facial.",
    order: 1,
  },
  {
    _id: "default-preso-10",
    title: "Bono 10 sesiones · Presoterapia",
    kind: "bono",
    sessions: 10,
    price: 150,
    originalPrice: 200,
    description:
      "Piernas ligeras, mejor circulación y menos retención con un plan de 10 sesiones.",
    order: 2,
  },
  {
    _id: "default-glow",
    title: "Pack Glow · Higiene facial + Dermapen",
    kind: "pack",
    price: 120,
    originalPrice: 145,
    description:
      "Tu piel luminosa para ese evento: limpieza profunda y dermapen en una misma cita.",
    order: 3,
  },
  {
    _id: "default-madero-5",
    title: "Bono 5 sesiones · Maderoterapia corporal",
    kind: "bono",
    sessions: 5,
    price: 140,
    originalPrice: 175,
    description:
      "Moldea la figura y reduce volumen con un plan progresivo de maderoterapia.",
    order: 4,
  },
  {
    _id: "default-tarjeta-regalo",
    title: "Tarjeta regalo",
    kind: "tarjeta-regalo",
    badge: "Ideal para regalar",
    description:
      "Regala bienestar: eliges el importe y la persona elige su tratamiento. Válida 12 meses.",
    order: 5,
  },
];
