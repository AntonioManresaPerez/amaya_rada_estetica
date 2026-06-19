"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop`;

const group: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const line: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// Portada del recorrido: la primera imagen asoma de fondo mientras el texto
// entra escalonado. El cue de scroll late al final. Reduce-motion lo neutraliza.
export function ScrollIntro({ photoId }: { photoId: number }) {
  return (
    <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 0.28, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <Image src={pexels(photoId)} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-deep-space/70" />
      </motion.div>

      <motion.div className="relative z-10" variants={group} initial="hidden" animate="visible">
        <motion.p variants={line} className="mb-3 text-sm uppercase tracking-[0.35em] text-vintage-lavender">
          Prototipo
        </motion.p>
        <motion.h1 variants={line} className="font-serif text-4xl text-white md:text-6xl">
          Nuestros servicios
        </motion.h1>
        <motion.p variants={line} className="mt-4 max-w-md text-lavender-veil/70">
          Desliza para recorrer cada tratamiento.
        </motion.p>
      </motion.div>

      <motion.span
        aria-hidden
        className="absolute bottom-10 z-10 text-2xl text-lavender-veil/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ opacity: { delay: 1 }, y: { repeat: Infinity, duration: 1.6, ease: "easeInOut" } }}
      >
        ↓
      </motion.span>
    </section>
  );
}
