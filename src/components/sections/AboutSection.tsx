"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/components/motion/animations";
import { cn } from "@/lib/utils";

export function AboutSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-lavender-veil/20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 items-center"
      >
        {/* Imagen placeholder con forma orgánica */}
        <motion.div variants={fadeUp} className="relative order-last lg:order-first">
          <div className="relative aspect-[4/5] max-w-md mx-auto">
            {/* Marco decorativo */}
            <div className="absolute -inset-4 rounded-[40%_60%_55%_45%/45%_55%_60%_40%] bg-thistle/25 -z-10" />
            <div className="h-full w-full rounded-[35%_65%_50%_50%/40%_50%_65%_45%] overflow-hidden bg-lavender-veil flex items-center justify-center">
              {/* Placeholder hasta que haya foto real */}
              <div className="text-center px-8">
                <div className="w-20 h-20 rounded-full bg-vintage-lavender/30 mx-auto mb-4 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-vintage-lavender" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <p className="text-sm text-vintage-lavender/70 italic">Foto de Amaya</p>
              </div>
            </div>
            {/* Elemento decorativo flotante */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-thistle/30 text-center min-w-[120px]">
              <p className="font-serif text-2xl text-vintage-lavender font-semibold">+10</p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">años de<br />experiencia</p>
            </div>
          </div>
        </motion.div>

        {/* Texto */}
        <motion.div variants={staggerContainer} className="space-y-6">
          <motion.p
            variants={fadeUp}
            className="text-sm tracking-[0.3em] uppercase text-vintage-lavender"
          >
            Sobre Amaya
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-4xl text-deep-space leading-tight sm:text-5xl"
          >
            Cuidarte es mi
            <br />
            <span className="text-vintage-lavender">pasión</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-muted-foreground leading-relaxed"
          >
            Soy Amaya Rada, estética especializada en tratamientos faciales y corporales avanzados.
            Mi centro nació de la convicción de que cada persona merece sentirse bien en su propia piel,
            con tratamientos adaptados a sus necesidades reales.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-muted-foreground leading-relaxed"
          >
            Con más de diez años de experiencia y formación continua en las últimas tecnologías estéticas,
            ofrezco un espacio íntimo en Murcia donde el resultado importa tanto como el bienestar durante
            cada sesión.
          </motion.p>

          <motion.ul
            variants={staggerContainer}
            className="grid grid-cols-2 gap-3 pt-2"
          >
            {[
              "Higiene facial avanzada",
              "Dermapen y mesoterapia",
              "Tratamientos corporales",
              "Pedicura terapéutica",
            ].map((item) => (
              <motion.li
                key={item}
                variants={fadeUp}
                className="flex items-center gap-2 text-sm text-indigo-velvet/80"
              >
                <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-vintage-lavender" />
                {item}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
            <Link href="/reservar" className={buttonVariants({ size: "lg" })}>
              Reservar cita
            </Link>
            <Link
              href="/servicios"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Ver tratamientos
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
