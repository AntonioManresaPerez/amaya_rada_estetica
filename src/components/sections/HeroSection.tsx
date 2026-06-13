"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/components/motion/animations";
import { HeroAura } from "@/components/decor/HeroAura";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  heroVideo?: string;
  tagline?: string;
}

export function HeroSection({ heroVideo, tagline }: HeroSectionProps) {
  const hasVideo = Boolean(heroVideo);
  const sectionRef = useRef<HTMLElement>(null);

  // Foco que sigue al cursor (--mx/--my) + parallax (--px/--py).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const px = (mx / r.width) * 2 - 1;
      const py = (my / r.height) * 2 - 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${mx}px`);
        el.style.setProperty("--my", `${my}px`);
        el.style.setProperty("--px", px.toFixed(3));
        el.style.setProperty("--py", py.toFixed(3));
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {hasVideo && (
        <video
          src={heroVideo}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}

      <div
        className={cn(
          "absolute inset-0 -z-20",
          hasVideo
            ? "bg-deep-space/65"
            : "bg-linear-to-b from-lavender-veil via-[#f0e8f6] to-background"
        )}
      />

      <HeroAura hasVideo={hasVideo} />

      {/* Parallax suave del contenido (sentido opuesto al cursor → profundidad) */}
      <div
        className="relative"
        style={{
          transform: "translate3d(calc(var(--px, 0) * -14px), calc(var(--py, 0) * -10px), 0)",
          transition: "transform 300ms ease-out",
        }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <motion.p
            variants={fadeUp}
            className={cn(
              "mb-4 text-sm tracking-[0.3em] uppercase",
              hasVideo ? "text-lavender-veil/80" : "text-vintage-lavender"
            )}
          >
            {tagline ?? "Centro de estética avanzada"}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className={cn(
              "mb-6 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl",
              hasVideo ? "text-white" : "hero-shimmer"
            )}
          >
            {siteConfig.name}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className={cn(
              "mx-auto mb-10 max-w-xl text-base sm:text-lg",
              hasVideo ? "text-lavender-veil/90" : "text-indigo-velvet/80"
            )}
          >
            {siteConfig.description}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Link href="/reservar" className={buttonVariants({ size: "lg" })}>
              Reservar cita
            </Link>
            <Link
              href="/servicios"
              className={buttonVariants({ size: "lg", variant: hasVideo ? "secondary" : "outline" })}
            >
              Ver servicios
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
