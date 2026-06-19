import type { Metadata } from "next";
import {
  ScrollServiceBlock,
  type ScrollBlockData,
} from "@/components/sections/scroll/ScrollServiceBlock";

// Prototipo: fuera del índice de Google mientras se evalúa el efecto.
export const metadata: Metadata = {
  title: "Servicios (scroll) — prototipo",
  robots: { index: false, follow: false },
};

// PROTOTIPO — datos locales solo para valorar el scrollytelling. Si se aprueba,
// se conectaría a los servicios reales de Sanity.
const BLOCKS: ScrollBlockData[] = [
  {
    id: "dermapen",
    number: "01",
    title: "Dermapen",
    subtitle: "Microagujas",
    description:
      "Estimula la producción de colágeno y renueva la piel mediante microcanales de precisión para un efecto rejuvenecedor visible.",
    photoId: 30809949,
    alt: "Tratamiento dermapen facial",
  },
  {
    id: "higiene-facial",
    number: "02",
    title: "Higiene Facial",
    subtitle: "Limpieza profunda",
    description:
      "Elimina impurezas, puntos negros y células muertas dejando tu piel luminosa, purificada y perfectamente oxigenada.",
    photoId: 3985329,
    alt: "Higiene facial profunda",
  },
  {
    id: "maderoterapia",
    number: "03",
    title: "Maderoterapia",
    subtitle: "Masaje con maderas",
    description:
      "Técnica de masaje con instrumentos de madera que reduce la celulitis, tonifica y esculpe el cuerpo de forma natural.",
    photoId: 6628691,
    alt: "Maderoterapia masaje corporal",
  },
];

export default function ServiciosScrollPage() {
  return (
    <main className="flex-1 bg-deep-space">
      {/* Intro */}
      <section className="flex h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-vintage-lavender">
          Prototipo
        </p>
        <h1 className="font-serif text-4xl text-white md:text-6xl">
          Nuestros servicios
        </h1>
        <p className="mt-4 max-w-md text-lavender-veil/70">
          Desliza para recorrer cada tratamiento.
        </p>
        <span aria-hidden className="mt-10 animate-bounce text-2xl text-lavender-veil/60">
          ↓
        </span>
      </section>

      {BLOCKS.map((b) => (
        <ScrollServiceBlock key={b.id} block={b} />
      ))}

      {/* Cierre */}
      <section className="flex h-[40vh] items-center justify-center px-6 text-center">
        <p className="text-lavender-veil/70">Fin del prototipo.</p>
      </section>
    </main>
  );
}
