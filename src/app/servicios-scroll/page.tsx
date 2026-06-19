import type { Metadata } from "next";
import { ScrollStage } from "@/components/sections/scroll/ScrollStage";
import { ScrollIntro } from "@/components/sections/scroll/ScrollIntro";
import { ScrollOutro } from "@/components/sections/scroll/ScrollOutro";
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
      <ScrollIntro photoId={SERVICES[0].photoId} />
      <ScrollStage services={SERVICES} />
      <ScrollOutro />
    </main>
  );
}
