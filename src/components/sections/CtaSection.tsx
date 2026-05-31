"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/components/motion/animations";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const text = encodeURIComponent("Hola Amaya, me gustaría reservar una cita.");
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`;

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-indigo-velvet to-deep-space">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.p
          variants={fadeUp}
          className="text-sm tracking-[0.3em] uppercase text-lavender-veil/70 mb-4"
        >
          Tu bienestar nos importa
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="font-serif text-4xl text-white mb-6 sm:text-5xl"
        >
          Reserva tu cita hoy
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-lavender-veil/80 mb-10 text-lg max-w-xl mx-auto"
        >
          Déjanos cuidarte con los tratamientos más avanzados. Primera consulta gratuita.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <Link
            href="/reservar"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-white text-indigo-velvet hover:bg-lavender-veil"
            )}
          >
            Reservar online
          </Link>
          <Link
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-lavender-veil/50 text-white hover:bg-white/10 hover:text-white"
            )}
          >
            WhatsApp
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
