"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/components/motion/animations";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { SanityService } from "@/types/sanity";

interface Props {
  services: SanityService[];
}

export function FeaturedServicesSection({ services }: Props) {
  if (!services.length) return null;

  return (
    <section className="py-24 px-6">
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
            Nuestros tratamientos
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-center font-serif text-4xl text-deep-space mb-16"
          >
            Servicios destacados
          </motion.h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <motion.article key={service._id} variants={fadeUp}>
                <Link
                  href={`/servicios/${service.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-thistle/40 bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-lavender-veil">
                    {service.image && (
                      <Image
                        src={urlFor(service.image).width(600).height(450).url()}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6 gap-3">
                    <h3 className="font-serif text-xl text-deep-space group-hover:text-vintage-lavender transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {service.shortDescription}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-thistle/20">
                      {service.price && (
                        <span className="text-sm font-medium text-vintage-lavender">
                          Desde {service.price}€
                        </span>
                      )}
                      <span
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "ml-auto"
                        )}
                      >
                        Ver más →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-12 text-center">
            <Link
              href="/servicios"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Ver todos los servicios
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
