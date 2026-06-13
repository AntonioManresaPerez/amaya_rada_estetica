"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/components/motion/animations";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const text = encodeURIComponent("Hola Amaya, me gustaría reservar una cita.");
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`;
  const handlingRef = useRef(false);

  useEffect(() => {
    let touchY = 0;

    const isAtTop = () => {
      const r = document.getElementById("reservar-cita")?.getBoundingClientRect();
      if (!r) return false;
      return r.top > -80 && r.top < 80;
    };

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return;
      if (!isAtTop() || e.deltaY >= 0) return;
      e.preventDefault();
      if (handlingRef.current) return;
      handlingRef.current = true;
      window.dispatchEvent(new Event("cta:exit-up"));
    };

    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (window.innerWidth < 768) return; // móvil: scroll natural, sin telón
      if (!isAtTop() || handlingRef.current) return;
      const delta = touchY - e.changedTouches[0].clientY;
      if (delta > -40) return;
      handlingRef.current = true;
      window.dispatchEvent(new Event("cta:exit-up"));
    };

    const onSettle = () => { handlingRef.current = false; };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("curtain:settle-in", onSettle);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("curtain:settle-in", onSettle);
    };
  }, []);

  return (
    <section id="reservar-cita" className="relative overflow-hidden py-16 md:py-24 px-6 bg-linear-to-br from-indigo-velvet to-deep-space">
      {/* Fundido Sobre mí → Reservar cita (escritorio y móvil): velo claro con
          destello lavanda/thistle que se disuelve en el índigo */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
        <div className="absolute left-1/2 -top-24 h-48 w-[150%] -translate-x-1/2 rounded-[50%] bg-radial from-lavender-veil/45 via-thistle/20 to-transparent blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-lavender-veil/40 via-thistle/12 to-transparent" />
      </div>
      {/* Fundido de color hacia el footer (escritorio y móvil): destello malva/índigo
          que se asienta en deep-space para empalmar sin corte con el footer */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 overflow-hidden">
        <div className="absolute left-1/2 bottom-3 h-48 w-[150%] -translate-x-1/2 rounded-[50%] bg-radial from-vintage-lavender/45 via-indigo-velvet/25 to-transparent blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-deep-space" />
      </div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto max-w-3xl text-center"
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
              "border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white hover:border-white"
            )}
          >
            WhatsApp
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
