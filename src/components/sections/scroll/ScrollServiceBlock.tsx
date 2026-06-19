"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export interface ScrollBlockData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  photoId: number;
  alt: string;
}

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop`;

const titleContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const titleWord = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

// Escena "fijada" (sticky) cuyo contenido se anima con el progreso del scroll.
// La animación de transform/escala se desactiva si el usuario pide menos movimiento.
export function ScrollServiceBlock({ block }: { block: ScrollBlockData }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1, 1.18]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const haloScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.15, 0.5]);
  const haloOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.65, 0]);
  const lineScale = useTransform(scrollYProgress, [0.12, 0.45], [0, 1]);
  const numberY = useTransform(scrollYProgress, [0, 1], ["35%", "-35%"]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 0.09, 0.09, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.05, 0.22, 0.78, 0.95], [0, 1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0.05, 0.22, 0.78, 0.95], [70, 0, 0, -50]);

  return (
    <section ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-deep-space">
        {/* Imagen con parallax + zoom */}
        <motion.div className="absolute inset-0" style={reduce ? {} : { y: imageY, scale: imageScale }}>
          <Image src={pexels(block.photoId)} alt={block.alt} fill sizes="100vw" className="object-cover" />
        </motion.div>
        {/* Velos: legibilidad + "unir" las escenas con el deep-space */}
        <div className="absolute inset-0 bg-deep-space/55" />
        <div className="absolute inset-0 bg-linear-to-b from-deep-space via-transparent to-deep-space" />

        {/* Halo lavanda que late con el scroll */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-vintage-lavender/50 via-indigo-velvet/20 to-transparent blur-3xl"
          style={reduce ? { opacity: 0.4 } : { scale: haloScale, opacity: haloOpacity }}
        />

        {/* Número gigante con deriva */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute right-4 select-none font-serif text-[8rem] leading-none text-white md:right-12 md:text-[20rem]"
          style={reduce ? { opacity: 0.09 } : { y: numberY, opacity: numberOpacity }}
        >
          {block.number}
        </motion.span>

        {/* Contenido */}
        <motion.div
          className="relative z-10 mx-auto max-w-2xl px-6 text-center"
          style={reduce ? {} : { opacity: contentOpacity, y: contentY }}
        >
          {/* Línea que se traza */}
          <motion.div
            className="mx-auto mb-5 h-px w-16 origin-center bg-vintage-lavender"
            style={reduce ? {} : { scaleX: lineScale }}
          />
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-lavender-veil/70 sm:text-sm">
            {block.number} &mdash; {block.subtitle}
          </p>
          {/* Título que se ensambla palabra a palabra */}
          <motion.h2
            className="mb-6 flex flex-wrap justify-center gap-x-4 font-serif text-5xl text-white sm:text-6xl md:text-7xl"
            variants={titleContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15%" }}
          >
            {block.title.split(" ").map((w, i) => (
              <motion.span key={i} variants={titleWord} className="inline-block">
                {w}
              </motion.span>
            ))}
          </motion.h2>
          <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-lavender-veil/85 md:text-lg">
            {block.description}
          </p>
          <Link
            href={`/reservar?servicio=${block.id}`}
            className="inline-flex min-h-11 items-center rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vintage-lavender"
          >
            Reservar tratamiento
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
