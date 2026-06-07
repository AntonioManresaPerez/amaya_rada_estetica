"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { staggerContainer, fadeUp } from "@/components/motion/animations";
import type { SanityTestimonial } from "@/types/sanity";

interface Props {
  testimonials: SanityTestimonial[];
}

function StarRating({ rating }: { rating?: number }) {
  const count = rating ?? 5;
  return (
    <div className="flex gap-0.5" aria-label={`${count} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < count
              ? "fill-vintage-lavender text-vintage-lavender"
              : "fill-thistle/40 text-thistle/40"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialsSection({ testimonials }: Props) {
  if (!testimonials.length) return null;

  return (
    <section className="py-16 md:py-24 px-6 bg-lavender-veil/30">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.p
            variants={fadeUp}
            className="text-center text-sm tracking-[0.3em] uppercase text-vintage-lavender mb-3"
          >
            Lo que dicen nuestras clientas
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-center font-serif text-4xl text-deep-space mb-10 md:mb-16"
          >
            Opiniones reales
          </motion.h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <motion.blockquote
                key={t._id}
                variants={fadeUp}
                className="flex flex-col gap-4 rounded-2xl border border-thistle/40 bg-card p-6 shadow-sm"
              >
                <StarRating rating={t.rating} />
                <p className="text-sm leading-relaxed text-foreground/80 italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer>
                  <cite className="not-italic text-sm font-medium text-indigo-velvet">
                    — {t.author}
                  </cite>
                  {t.service && (
                    <p className="text-xs text-muted-foreground mt-0.5">{t.service}</p>
                  )}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
