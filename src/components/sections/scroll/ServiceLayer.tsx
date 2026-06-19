"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useTransform, type MotionValue } from "framer-motion";

export interface ScrollService {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  photoId: number;
  alt: string;
  halo: string; // clases de gradiente para el tinte del halo
}

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop`;

// Línea con máscara: el texto sube desde detrás de un borde oculto (reveal premium).
function MaskLine({
  y,
  reduce,
  className,
  children,
}: {
  y: MotionValue<string>;
  reduce: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (reduce) return <span className={`block ${className ?? ""}`}>{children}</span>;
  return (
    <span className="block overflow-hidden">
      <motion.span style={{ y }} className={`block pb-[0.12em] ${className ?? ""}`}>
        {children}
      </motion.span>
    </span>
  );
}

export function ServiceLayer({
  service,
  index,
  count,
  progress,
  reduce,
}: {
  service: ScrollService;
  index: number;
  count: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const N = count;
  const tw = 0.4 / N; // ancho de la zona de crossfade
  const s = index / N;
  const e = (index + 1) / N;
  const center = (s + e) / 2;

  // Crossfade entre capas; la primera y la última se mantienen en los extremos.
  const opInput: number[] = [];
  const opOutput: number[] = [];
  if (index === 0) { opInput.push(0); opOutput.push(1); }
  else { opInput.push(s - tw, s + tw); opOutput.push(0, 1); }
  if (index === N - 1) { opInput.push(1); opOutput.push(1); }
  else { opInput.push(e - tw, e + tw); opOutput.push(1, 0); }

  const opacity = useTransform(progress, opInput, opOutput);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const scale = useTransform(progress, [s - tw, center, e + tw], [1.14, 1, 1.14]);
  const imgY = useTransform(progress, [s, e], ["-4%", "4%"]);

  // Progreso local (0→1) dentro de la ventana de esta capa.
  const lp = useTransform(progress, [s, e], [0, 1]);
  const subY = useTransform(lp, [0.04, 0.22, 0.8, 0.96], ["120%", "0%", "0%", "-120%"]);
  const titleY = useTransform(lp, [0.1, 0.3, 0.74, 0.92], ["120%", "0%", "0%", "-120%"]);
  const descY = useTransform(lp, [0.18, 0.4, 0.68, 0.88], ["120%", "0%", "0%", "-120%"]);
  const lineScaleX = useTransform(lp, [0.08, 0.3, 0.8, 0.95], [0, 1, 1, 0]);
  const haloScale = useTransform(lp, [0, 0.5, 1], [0.6, 1.12, 0.6]);
  const haloOpacity = useTransform(lp, [0.05, 0.5, 0.95], [0, 0.7, 0]);
  const btnOpacity = useTransform(lp, [0.26, 0.44, 0.66, 0.84], [0, 1, 1, 0]);
  const btnY = useTransform(lp, [0.26, 0.44], [24, 0]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity, pointerEvents }}>
      {/* Imagen con parallax + zoom */}
      <motion.div className="absolute inset-0" style={reduce ? {} : { y: imgY, scale }}>
        <Image src={pexels(service.photoId)} alt={service.alt} fill priority={index === 0} sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-deep-space/55" />
      <div className="absolute inset-0 bg-linear-to-b from-deep-space via-transparent to-deep-space" />

      {/* Halo con tinte por servicio */}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial ${service.halo} blur-3xl`}
        style={reduce ? { opacity: 0.35 } : { scale: haloScale, opacity: haloOpacity }}
      />

      {/* Número gigante de fondo */}
      <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-serif text-[7rem] leading-none text-white/[0.07] md:right-12 md:text-[19rem]">
        {service.number}
      </span>

      {/* Contenido */}
      <div className="absolute inset-0 z-10 mx-auto flex max-w-2xl flex-col items-center justify-center px-6 text-center">
        <motion.div className="mb-5 h-px w-16 origin-center bg-vintage-lavender" style={reduce ? {} : { scaleX: lineScaleX }} />
        <div className="mb-4 text-xs uppercase tracking-[0.35em] text-lavender-veil/70 sm:text-sm">
          <MaskLine y={subY} reduce={reduce}>{service.number} &mdash; {service.subtitle}</MaskLine>
        </div>
        <h2 className="mb-6 font-serif text-5xl text-white sm:text-6xl md:text-7xl">
          <MaskLine y={titleY} reduce={reduce}>{service.title}</MaskLine>
        </h2>
        <div className="mb-8 max-w-md text-base leading-relaxed text-lavender-veil/85 md:text-lg">
          <MaskLine y={descY} reduce={reduce}>{service.description}</MaskLine>
        </div>
        <motion.div style={reduce ? {} : { opacity: btnOpacity, y: btnY }}>
          <Link
            href={`/reservar?servicio=${service.id}`}
            className="inline-flex min-h-11 items-center rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vintage-lavender"
          >
            Reservar tratamiento
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
