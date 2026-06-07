"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/components/motion/animations";
import { cn } from "@/lib/utils";

export function AboutSection() {
  const handlingRef = useRef(false);

  useEffect(() => {
    let touchY = 0;

    const isInView = () => {
      const r = document.getElementById("sobre-mi")?.getBoundingClientRect();
      if (!r) return false;
      return r.top > -80 && r.top < 80 && r.bottom > window.innerHeight - 80;
    };

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return;
      if (!isInView() || e.deltaY <= 0) return;
      e.preventDefault();
      if (handlingRef.current) return;
      handlingRef.current = true;
      window.dispatchEvent(new Event("about:exit-down"));
    };

    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isInView() || handlingRef.current) return;
      const delta = touchY - e.changedTouches[0].clientY;
      if (delta < 40) return;
      handlingRef.current = true;
      window.dispatchEvent(new Event("about:exit-down"));
    };

    const onSettle = () => { handlingRef.current = false; };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("curtain:settle-out", onSettle);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("curtain:settle-out", onSettle);
    };
  }, []);

  return (
    <section
      id="sobre-mi"
      className="min-h-screen flex items-center px-6 py-20 bg-linear-to-b from-background to-lavender-veil/20"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto w-full max-w-7xl grid gap-10 lg:gap-16 lg:grid-cols-2 items-center"
      >
        {/* Imagen */}
        <motion.div variants={fadeUp} className="relative order-last lg:order-first">
          <div className="relative aspect-4/5 w-full">
            {/* Marco decorativo */}
            <div className="absolute -inset-4 rounded-[40%_60%_55%_45%/45%_55%_60%_40%] bg-thistle/25 -z-10" />
            <div className="relative h-full w-full rounded-[35%_65%_50%_50%/40%_50%_65%_45%] overflow-hidden bg-lavender-veil isolate">
              {/*
                FOTO: coloca tu imagen en public/amaya-rada.webp
                Recomendado: WebP, 800×1000 px, < 200 KB
              */}
              <Image
                src="/amaya-rada.webp"
                alt="Amaya Rada, esteticista en Murcia"
                fill
                className="object-cover object-[50%_15%]"
                priority
              />
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
                <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-vintage-lavender" />
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
