"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const CDN = "https://images.pexels.com/photos";
const N = 8;

function pexelsUrl(id: number) {
  return `${CDN}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop`;
}

const services = [
  {
    id: "dermapen", number: "01", title: "Dermapen", subtitle: "Microagujas",
    description: "Estimula la producción de colágeno y renueva la piel mediante microcanales de precisión para un efecto rejuvenecedor visible.",
    photoId: 30809949, alt: "Tratamiento de dermapen facial en clínica",
    flexCls: "items-end justify-start",
    padCls: "px-6 pb-16 md:pl-20 md:pb-24",
    alignCls: "",
  },
  {
    id: "higiene-facial", number: "02", title: "Higiene Facial", subtitle: "Limpieza profunda",
    description: "Elimina impurezas, puntos negros y células muertas dejando tu piel luminosa, purificada y perfectamente oxigenada.",
    photoId: 3985329, alt: "Higiene facial profunda en centro de estética",
    flexCls: "items-end justify-start md:justify-end",
    padCls: "px-6 pb-16 md:pl-0 md:pr-20 md:pb-24",
    alignCls: "md:text-right",
  },
  {
    id: "laser", number: "03", title: "Láser", subtitle: "Tecnología avanzada",
    description: "Tratamiento de alta precisión para eliminar vello no deseado, manchas y estimular la regeneración cutánea.",
    photoId: 4586726, alt: "Tratamiento láser estético",
    flexCls: "items-end justify-start md:items-center",
    padCls: "px-6 pb-16 md:pl-20 md:pb-0",
    alignCls: "",
  },
  {
    id: "pedicura", number: "04", title: "Pedicura", subtitle: "Cuidado del pie",
    description: "Tratamiento completo de higiene y embellecimiento del pie para mantenerlos sanos, suaves e impecables.",
    photoId: 34930123, alt: "Pedicura profesional en salón de belleza",
    flexCls: "items-end justify-start md:items-start md:justify-end",
    padCls: "px-6 pb-16 md:pl-0 md:pr-20 md:pb-0 md:pt-32",
    alignCls: "md:text-right",
  },
  {
    id: "maderoterapia", number: "05", title: "Maderoterapia", subtitle: "Masaje con maderas",
    description: "Técnica de masaje con instrumentos de madera que reduce la celulitis, tonifica y esculpe el cuerpo de forma natural.",
    photoId: 6628691, alt: "Maderoterapia masaje corporal con herramientas de madera",
    flexCls: "items-end justify-start",
    padCls: "px-6 pb-16 md:pl-20 md:pb-24",
    alignCls: "",
  },
  {
    id: "presoterapia", number: "06", title: "Presoterapia", subtitle: "Drenaje linfático",
    description: "Mejora la circulación, reduce la retención de líquidos y combate la celulitis mediante presión controlada.",
    photoId: 5888064, alt: "Presoterapia drenaje linfático en piernas",
    flexCls: "items-end justify-start md:items-center md:justify-end",
    padCls: "px-6 pb-16 md:pl-0 md:pr-20 md:pb-0",
    alignCls: "md:text-right",
  },
  {
    id: "manchas", number: "07", title: "Tratamiento de Manchas", subtitle: "Uniformidad cutánea",
    description: "Reduce y elimina manchas, hiperpigmentación y daño solar para recuperar una piel más uniforme y radiante.",
    photoId: 5701545, alt: "Tratamiento de manchas y pigmentación en la piel",
    flexCls: "items-end justify-start md:justify-center",
    padCls: "px-6 pb-16 md:pb-24",
    alignCls: "md:text-center",
  },
  {
    id: "vacum", number: "08", title: "Vacum", subtitle: "Masaje aspirativo",
    description: "Técnica de vacío que tonifica, modela y reactiva la circulación en zonas con celulitis y flacidez.",
    photoId: 8312823, alt: "Vacum masaje aspirativo corporal",
    flexCls: "items-end justify-start md:items-center",
    padCls: "px-6 pb-16 md:pl-20 md:pb-0",
    alignCls: "",
  },
];

function ServiceSlide({
  service,
  index,
  progress,
}: {
  service: (typeof services)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const sStart = index / N;
  const sEnd = (index + 1) / N;
  // Wipe ends at 28% into this section's range; text done at 58%
  const wipeEnd = sStart + (sEnd - sStart) * 0.28;
  const textEnd = wipeEnd + (sEnd - sStart) * 0.3;

  // Static for first slide, curtain-up for the rest
  const yIn = index === 0 ? [0, 1] : [sStart, wipeEnd];
  const yOut = index === 0 ? ["0%", "0%"] : ["103%", "0%"];

  // Text enters after the wipe; static for first slide
  const tIn = index === 0 ? [0, 1] : [wipeEnd, textEnd];
  const opOut = index === 0 ? [1, 1] : [0, 1];
  const yTOut = index === 0 ? [0, 0] : [28, 0];

  const curtainY = useTransform(progress, yIn, yOut);
  // Parallax while dwelling on the section
  const bgY = useTransform(progress, [sStart, sEnd], ["5%", "-5%"]);
  const textOpacity = useTransform(progress, tIn, opOut);
  const textDY = useTransform(progress, tIn, yTOut);

  const isRight = service.alignCls.includes("text-right");
  const isCenter = service.alignCls.includes("text-center");

  return (
    <motion.div
      style={{ y: curtainY }}
      className={`absolute inset-0 flex ${service.flexCls}`}
    >
      {/* Background with parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-x-0 top-[-7%] bottom-[-7%]">
        <Image
          src={pexelsUrl(service.photoId)}
          alt={service.alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority={index <= 1}
        />
      </motion.div>

      {/* Base tint + directional gradient */}
      <div className="absolute inset-0 bg-deep-space/40" />
      <div className="absolute inset-0 bg-linear-to-t from-deep-space/90 via-deep-space/15 to-transparent" />

      {/* Decorative number */}
      <span
        aria-hidden
        className="absolute right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none font-serif leading-none text-white/[0.05] text-[8rem] md:text-[15rem]"
      >
        {service.number}
      </span>

      {/* Text */}
      <motion.div
        style={{ opacity: textOpacity, y: textDY }}
        className={`relative z-10 max-w-lg ${service.padCls} ${service.alignCls}`}
      >
        <div
          className={`mb-4 h-px w-14 bg-vintage-lavender/80 ${
            isRight ? "md:ml-auto" : isCenter ? "mx-auto" : ""
          }`}
        />
        <p className="mb-2 text-xs tracking-[0.35em] uppercase text-lavender-veil/55">
          {service.number} &mdash; {service.subtitle}
        </p>
        <h2 className="mb-4 font-serif text-5xl leading-none text-white md:text-7xl">
          {service.title}
        </h2>
        <p
          className={`mb-8 max-w-sm text-sm leading-relaxed text-lavender-veil/75 md:text-base ${
            isRight ? "md:ml-auto" : isCenter ? "mx-auto" : ""
          }`}
        >
          {service.description}
        </p>
        <Link
          href="/reservar"
          className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          Reservar tratamiento
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function ServicesFullscreenSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    // 100vh per service = 800vh total — enough dwell time to feel relaxed
    <div ref={ref} style={{ height: `${N * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {services.map((s, i) => (
          <ServiceSlide key={s.id} service={s} index={i} progress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}
