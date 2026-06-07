"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/components/motion/animations";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  heroVideo?: string;
  tagline?: string;
}

export function HeroSection({ heroVideo, tagline }: HeroSectionProps) {
  const hasVideo = Boolean(heroVideo);

  return (
    <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden">
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
          "absolute inset-0 -z-10",
          hasVideo
            ? "bg-deep-space/65"
            : "bg-linear-to-b from-lavender-veil via-[#f0e8f6] to-background"
        )}
      />

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
            hasVideo ? "text-white" : "text-deep-space"
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
    </section>
  );
}
