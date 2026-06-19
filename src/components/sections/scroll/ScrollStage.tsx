"use client";

import { useRef } from "react";
import { useScroll, useReducedMotion } from "framer-motion";
import { ServiceLayer, type ScrollService } from "./ServiceLayer";
import { ScrollProgressRail } from "./ScrollProgressRail";
import { Atmosphere } from "./Atmosphere";

// Escenario único: todas las capas se superponen y hacen crossfade/zoom con un
// solo scroll. La altura del contenedor reserva ~100vh de recorrido por servicio.
export function ScrollStage({ services }: { services: ScrollService[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: `${(services.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-deep-space">
        {services.map((s, i) => (
          <ServiceLayer
            key={s.id}
            service={s}
            index={i}
            count={services.length}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}
        {!reduce && <Atmosphere progress={scrollYProgress} />}
        <ScrollProgressRail services={services} progress={scrollYProgress} />
      </div>
    </div>
  );
}
