"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import type { ScrollService } from "./ServiceLayer";

// Índice/“capítulos” del recorrido: línea que se rellena con el scroll y marca
// el servicio activo. En móvil se reduce a una barra fina superior.
export function ScrollProgressRail({
  services,
  progress,
}: {
  services: ScrollService[];
  progress: MotionValue<number>;
}) {
  const N = services.length;
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    setActive(Math.min(N - 1, Math.max(0, Math.floor(p * N + 1e-4))));
  });
  const fill = useTransform(progress, [0, 1], [0, 1]);

  return (
    <>
      {/* Barra superior (móvil) */}
      <motion.div
        className="absolute left-0 top-0 z-30 h-0.5 w-full origin-left bg-vintage-lavender md:hidden"
        style={{ scaleX: fill }}
      />

      {/* Índice lateral (escritorio) */}
      <nav aria-hidden className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 md:block">
        <div className="relative flex flex-col items-end gap-6 pr-3">
          <span className="absolute right-[5px] top-1.5 bottom-1.5 w-px bg-white/15" />
          <motion.span
            className="absolute right-[5px] top-1.5 h-[calc(100%-0.75rem)] w-px origin-top bg-vintage-lavender"
            style={{ scaleY: fill }}
          />
          {services.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span
                className={`font-serif text-xs transition-colors duration-300 ${
                  i === active ? "text-white" : "text-white/35"
                }`}
              >
                {s.number}
              </span>
              <span
                className={`-mr-[3px] h-2 w-2 rounded-full transition-all duration-300 ${
                  i === active ? "scale-125 bg-vintage-lavender" : "bg-white/30"
                }`}
              />
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
