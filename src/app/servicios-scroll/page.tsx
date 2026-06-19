import type { Metadata } from "next";
import Link from "next/link";
import { ScrollStage } from "@/components/sections/scroll/ScrollStage";
import type { ScrollService } from "@/components/sections/scroll/ServiceLayer";

// Prototipo: fuera del índice de Google mientras se evalúa el efecto.
export const metadata: Metadata = {
  title: "Servicios (scroll) — prototipo",
  robots: { index: false, follow: false },
};

// PROTOTIPO — datos locales solo para valorar el scrollytelling. Si se aprueba,
// se conectaría a los servicios reales de Sanity.
const SERVICES: ScrollService[] = [
  {
    id: "dermapen",
    number: "01",
    title: "Dermapen",
    subtitle: "Microagujas",
    description:
      "Estimula la producción de colágeno y renueva la piel mediante microcanales de precisión para un efecto rejuvenecedor visible.",
    photoId: 30809949,
    alt: "Tratamiento dermapen facial",
    halo: "from-vintage-lavender/55 via-indigo-velvet/20 to-transparent",
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
    halo: "from-thistle/55 via-vintage-lavender/20 to-transparent",
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
    halo: "from-indigo-velvet/60 via-vintage-lavender/20 to-transparent",
  },
];

export default function ServiciosScrollPage() {
  return (
    <main className="flex-1 bg-deep-space text-white">
      {/* Intro */}
      <section className="flex h-[85vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-vintage-lavender">
          Prototipo
        </p>
        <h1 className="font-serif text-4xl md:text-6xl">Nuestros servicios</h1>
        <p className="mt-4 max-w-md text-lavender-veil/70">
          Desliza para recorrer cada tratamiento.
        </p>
        <span aria-hidden className="mt-10 animate-bounce text-2xl text-lavender-veil/60">
          ↓
        </span>
      </section>

      <ScrollStage services={SERVICES} />

      {/* Cierre con CTA */}
      <section className="flex h-[85vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="font-serif text-3xl text-white md:text-5xl">
          ¿Reservamos tu cita?
        </h2>
        <p className="mt-4 max-w-md text-lavender-veil/70">
          Tu primera consulta de valoración es gratuita.
        </p>
        <Link
          href="/reservar"
          className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-white px-7 py-3.5 text-sm font-medium text-indigo-velvet transition-colors hover:bg-lavender-veil focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Reservar cita
        </Link>
      </section>
    </main>
  );
}
