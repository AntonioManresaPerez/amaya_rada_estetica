"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const group: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } };
const line: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// Cierre del recorrido con CTA. El reveal se dispara al entrar en pantalla.
export function ScrollOutro() {
  return (
    <section className="flex h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        variants={group}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20%" }}
      >
        <motion.h2 variants={line} className="font-serif text-3xl text-white md:text-5xl">
          ¿Reservamos tu cita?
        </motion.h2>
        <motion.p variants={line} className="mx-auto mt-4 max-w-md text-lavender-veil/70">
          Tu primera consulta de valoración es gratuita.
        </motion.p>
        <motion.div variants={line} className="mt-8">
          <Link
            href="/reservar"
            className="inline-flex min-h-11 items-center rounded-xl bg-white px-7 py-3.5 text-sm font-medium text-indigo-velvet transition-colors hover:bg-lavender-veil focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Reservar cita
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
