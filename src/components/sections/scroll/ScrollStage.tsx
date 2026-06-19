"use client";

import { useEffect, useRef, useState } from "react";
import {
  useScroll,
  useReducedMotion,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { ServiceLayer, type ScrollService } from "./ServiceLayer";
import { ScrollProgressRail } from "./ScrollProgressRail";
import { Atmosphere } from "./Atmosphere";

// Escenario único: todas las capas se superponen y hacen crossfade/zoom con un
// solo scroll. La altura del contenedor reserva ~100vh de recorrido por servicio.
export function ScrollStage({ services }: { services: ScrollService[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [isDesktop, setIsDesktop] = useState(false);
  const depth = isDesktop && !reduce; // parallax de ratón + desenfoque por velocidad

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const velocity = useVelocity(scrollYProgress);
  const smoothVel = useSpring(velocity, { stiffness: 60, damping: 18, mass: 0.4 });
  const velSkew = useTransform(smoothVel, (v) => Math.max(-3, Math.min(3, v * 2)));
  const velBlur = useTransform(smoothVel, (v) => `blur(${Math.min(Math.abs(v) * 2.4, 3).toFixed(2)}px)`);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smx = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.4 });
  const smy = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!depth) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [depth, mouseX, mouseY]);

  const scrollToIndex = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const dist = el.offsetHeight - window.innerHeight;
    const target = top + ((i + 0.5) / services.length) * dist;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <div ref={ref} className="relative" style={{ height: `${(services.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-deep-space">
        {services.map((s, i) => (
          <ServiceLayer
            key={s.id}
            service={s}
            index={i}
            count={services.length}
            progress={scrollYProgress}
            mouseX={smx}
            mouseY={smy}
            velSkew={velSkew}
            velBlur={velBlur}
            reduce={reduce}
            depth={depth}
          />
        ))}
        {!reduce && <Atmosphere velocity={smoothVel} />}
        <ScrollProgressRail services={services} progress={scrollYProgress} onSelect={scrollToIndex} />
      </div>
    </div>
  );
}
