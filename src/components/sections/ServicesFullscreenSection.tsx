"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CDN = "https://images.pexels.com/photos";

const services = [
  {
    id: "dermapen",
    number: "01",
    title: "Dermapen",
    subtitle: "Microagujas",
    description:
      "Estimula la producción de colágeno y renueva la piel mediante microcanales de precisión para un efecto rejuvenecedor visible.",
    photoId: 30809949,
    alt: "Tratamiento de dermapen facial en clínica",
  },
  {
    id: "higiene-facial",
    number: "02",
    title: "Higiene Facial",
    subtitle: "Limpieza profunda",
    description:
      "Elimina impurezas, puntos negros y células muertas dejando tu piel luminosa, purificada y perfectamente oxigenada.",
    photoId: 3985329,
    alt: "Higiene facial profunda en centro de estética",
  },
  {
    id: "laser",
    number: "03",
    title: "Láser",
    subtitle: "Tecnología avanzada",
    description:
      "Tratamiento de alta precisión para eliminar vello no deseado, manchas y estimular la regeneración cutánea.",
    photoId: 4586726,
    alt: "Tratamiento láser estético",
  },
  {
    id: "pedicura",
    number: "04",
    title: "Pedicura",
    subtitle: "Cuidado del pie",
    description:
      "Tratamiento completo de higiene y embellecimiento del pie para mantenerlos sanos, suaves e impecables.",
    photoId: 34930123,
    alt: "Pedicura profesional en salón de belleza",
  },
  {
    id: "maderoterapia",
    number: "05",
    title: "Maderoterapia",
    subtitle: "Masaje con maderas",
    description:
      "Técnica de masaje con instrumentos de madera que reduce la celulitis, tonifica y esculpe el cuerpo de forma natural.",
    photoId: 6628691,
    alt: "Maderoterapia masaje corporal con herramientas de madera",
  },
  {
    id: "presoterapia",
    number: "06",
    title: "Presoterapia",
    subtitle: "Drenaje linfático",
    description:
      "Mejora la circulación, reduce la retención de líquidos y combate la celulitis mediante presión controlada.",
    photoId: 5888064,
    alt: "Presoterapia drenaje linfático en piernas",
  },
  {
    id: "manchas",
    number: "07",
    title: "Tratamiento de Manchas",
    subtitle: "Uniformidad cutánea",
    description:
      "Reduce y elimina manchas, hiperpigmentación y daño solar para recuperar una piel más uniforme y radiante.",
    photoId: 5701545,
    alt: "Tratamiento de manchas y pigmentación en la piel",
  },
  {
    id: "vacum",
    number: "08",
    title: "Vacum",
    subtitle: "Masaje aspirativo",
    description:
      "Técnica de vacío que tonifica, modela y reactiva la circulación en zonas con celulitis y flacidez.",
    photoId: 8312823,
    alt: "Vacum masaje aspirativo corporal",
  },
];

function pexelsUrl(id: number) {
  return `${CDN}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop`;
}

export function ServicesFullscreenSection() {
  return (
    <section aria-label="Nuestros servicios">
      {services.map((service, i) => (
        <div
          key={service.id}
          className="relative h-screen overflow-hidden flex items-end"
        >
          <Image
            src={pexelsUrl(service.photoId)}
            alt={service.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />

          {/* Gradient — oscuro abajo, transparente arriba */}
          <div className="absolute inset-0 bg-linear-to-t from-deep-space/90 via-deep-space/30 to-transparent" />

          {/* Número grande decorativo */}
          <span
            aria-hidden
            className="absolute right-4 bottom-4 select-none pointer-events-none font-serif leading-none text-white/[0.04] text-[8rem] md:text-[14rem]"
          >
            {service.number}
          </span>

          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 px-6 pb-12 max-w-xl md:px-16 md:pb-20"
          >
            <p className="mb-3 text-xs tracking-[0.35em] uppercase text-lavender-veil/60">
              {service.number} &mdash; {service.subtitle}
            </p>
            <h2 className="mb-4 font-serif text-5xl leading-tight text-white md:text-7xl">
              {service.title}
            </h2>
            <p className="mb-8 max-w-sm text-base leading-relaxed text-lavender-veil/75 md:text-lg">
              {service.description}
            </p>
            <Link
              href="/reservar"
              className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Reservar tratamiento
            </Link>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
