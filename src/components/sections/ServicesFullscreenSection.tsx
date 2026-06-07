"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

const CDN = "https://images.pexels.com/photos";
const N = 8;
const pexelsUrl = (id: number) =>
  `${CDN}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop`;
const pexelsMobile = (id: number) =>
  `${CDN}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop`;

const services = [
  { id: "dermapen",       number: "01", title: "Dermapen",              subtitle: "Microagujas",         description: "Estimula la producción de colágeno y renueva la piel mediante microcanales de precisión para un efecto rejuvenecedor visible.",              photoId: 30809949, alt: "Tratamiento dermapen facial",              flexCls: "items-end justify-start",                              padCls: "px-6 pb-16 md:pl-20 md:pb-24",              alignCls: ""               },
  { id: "higiene-facial", number: "02", title: "Higiene Facial",        subtitle: "Limpieza profunda",   description: "Elimina impurezas, puntos negros y células muertas dejando tu piel luminosa, purificada y perfectamente oxigenada.",                          photoId: 3985329,  alt: "Higiene facial profunda",                 flexCls: "items-end justify-start md:justify-end",               padCls: "px-6 pb-16 md:pl-0 md:pr-20 md:pb-24",      alignCls: "md:text-right"  },
  { id: "laser",          number: "03", title: "Láser",                 subtitle: "Tecnología avanzada", description: "Tratamiento de alta precisión para eliminar vello no deseado, manchas y estimular la regeneración cutánea.",                                  photoId: 4586726,  alt: "Tratamiento láser estético",              flexCls: "items-end justify-start md:items-center",              padCls: "px-6 pb-16 md:pl-20 md:pb-0",               alignCls: ""               },
  { id: "pedicura",       number: "04", title: "Pedicura",              subtitle: "Cuidado del pie",     description: "Tratamiento completo de higiene y embellecimiento del pie para mantenerlos sanos, suaves e impecables.",                                       photoId: 34930123, alt: "Pedicura profesional",                    flexCls: "items-end justify-start md:items-start md:justify-end", padCls: "px-6 pb-16 md:pl-0 md:pr-20 md:pb-0 md:pt-32", alignCls: "md:text-right" },
  { id: "maderoterapia",  number: "05", title: "Maderoterapia",         subtitle: "Masaje con maderas",  description: "Técnica de masaje con instrumentos de madera que reduce la celulitis, tonifica y esculpe el cuerpo de forma natural.",                         photoId: 6628691,  alt: "Maderoterapia masaje corporal",           flexCls: "items-end justify-start",                              padCls: "px-6 pb-16 md:pl-20 md:pb-24",              alignCls: ""               },
  { id: "presoterapia",   number: "06", title: "Presoterapia",          subtitle: "Drenaje linfático",   description: "Mejora la circulación, reduce la retención de líquidos y combate la celulitis mediante presión controlada.",                                   photoId: 5888064,  alt: "Presoterapia drenaje linfático",          flexCls: "items-end justify-start md:items-center md:justify-end",padCls: "px-6 pb-16 md:pl-0 md:pr-20 md:pb-0",       alignCls: "md:text-right"  },
  { id: "manchas",        number: "07", title: "Tratamiento de Manchas",subtitle: "Uniformidad cutánea", description: "Reduce y elimina manchas, hiperpigmentación y daño solar para recuperar una piel más uniforme y radiante.",                                   photoId: 5701545,  alt: "Tratamiento de manchas",                  flexCls: "items-end justify-start md:justify-center",            padCls: "px-6 pb-16 md:pb-24",                        alignCls: "md:text-center" },
  { id: "vacum",          number: "08", title: "Vacum",                 subtitle: "Masaje aspirativo",   description: "Técnica de vacío que tonifica, modela y reactiva la circulación en zonas con celulitis y flacidez.",                                          photoId: 8312823,  alt: "Vacum masaje aspirativo",                 flexCls: "items-end justify-start md:items-center",              padCls: "px-6 pb-16 md:pl-20 md:pb-0",               alignCls: ""               },
];

function ServiceSlide({ service }: { service: (typeof services)[number] }) {
  const isRight = service.alignCls.includes("text-right");
  const isCenter = service.alignCls.includes("text-center");
  return (
    <div className={`absolute inset-0 flex bg-deep-space ${service.flexCls}`}>
      <div className="absolute inset-x-0 top-[-5%] bottom-[-5%]">
        {/* Portrait crop for mobile — fills the tall viewport without awkward landscape slicing */}
        <Image src={pexelsMobile(service.photoId)} alt={service.alt} fill className="object-cover md:hidden" sizes="(max-width: 767px) 100vw, 1px" priority />
        {/* Landscape crop for tablet/desktop */}
        <Image src={pexelsUrl(service.photoId)} alt={service.alt} fill className="object-cover hidden md:block" sizes="(min-width: 768px) 100vw, 1px" priority />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-deep-space/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-deep-space/90 via-deep-space/20 to-transparent" />
      <span aria-hidden className="absolute right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none font-serif leading-none text-white/5 text-[8rem] md:text-[15rem]">
        {service.number}
      </span>
      <div className={`relative z-10 max-w-lg ${service.padCls} ${service.alignCls}`}>
        <div className={`mb-4 h-px w-14 bg-vintage-lavender/80 ${isRight ? "md:ml-auto" : isCenter ? "mx-auto" : ""}`} />
        <p className="mb-2 text-xs tracking-[0.35em] uppercase text-lavender-veil/55">{service.number} &mdash; {service.subtitle}</p>
        <h2 className="mb-4 font-serif text-5xl leading-none text-white md:text-7xl">{service.title}</h2>
        <p className={`mb-8 max-w-sm text-sm leading-relaxed text-lavender-veil/75 md:text-base ${isRight ? "md:ml-auto" : isCenter ? "mx-auto" : ""}`}>{service.description}</p>
        <Link href="/reservar" className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20">
          Reservar tratamiento
        </Link>
      </div>
    </div>
  );
}

const absTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

export function ServicesFullscreenSection() {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const lockRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const curtainP = useMotionValue(-1); // -1 = above | 0 = covering | 1 = below
  const curtainY = useTransform(curtainP, [-1, 0, 1], ["-100%", "0%", "100%"]);

  const runAnim = useCallback(
    (to: number) =>
      new Promise<void>(res => animate(curtainP, to, { duration: 0.9, ease: [0.76, 0, 0.24, 1], onComplete: res })),
    [curtainP],
  );

  // Is the section filling the viewport right now?
  const isInSection = useCallback(() => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return false;
    return r.top > -80 && r.top < 80 && r.bottom > window.innerHeight - 80;
  }, []);

  // Is the section just off-screen and about to enter?
  const isApproaching = useCallback((down: boolean) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return false;
    const vh = window.innerHeight;
    if (down && r.top > 10 && r.top < vh + 50) return true;   // coming from Hero
    if (!down && r.bottom > -50 && r.bottom < 100) return true; // coming from About
    return false;
  }, []);

  // Transition between services
  const goTo = useCallback((idx: number, dir: 1 | -1) => {
    if (lockRef.current) return;
    lockRef.current = true;
    window.dispatchEvent(new Event("curtain:open"));
    if (isMobile()) {
      setCurrent(idx); currentRef.current = idx;
      setTimeout(() => { lockRef.current = false; window.dispatchEvent(new Event("curtain:settle-in")); }, 500);
      return;
    }
    curtainP.set(dir > 0 ? -1 : 1);
    runAnim(0)
      .then(() => { setCurrent(idx); currentRef.current = idx; })
      .then(() => new Promise<void>(r => setTimeout(r, 100)))
      .then(() => runAnim(dir > 0 ? 1 : -1))
      .then(() => { lockRef.current = false; window.dispatchEvent(new Event("curtain:settle-in")); });
  }, [curtainP, runAnim]);

  // Transition to a different page section (Hero or About) — scrolls while curtain covers
  const goExternal = useCallback((scrollFn: () => void, dir: 1 | -1) => {
    if (lockRef.current) return;
    lockRef.current = true;
    window.dispatchEvent(new Event("curtain:open"));
    if (isMobile()) {
      scrollFn();
      setTimeout(() => { lockRef.current = false; window.dispatchEvent(new Event("curtain:settle-out")); }, 300);
      return;
    }
    curtainP.set(dir > 0 ? -1 : 1);
    runAnim(0)
      .then(() => { scrollFn(); return new Promise<void>(r => setTimeout(r, 80)); })
      .then(() => runAnim(dir > 0 ? 1 : -1))
      .then(() => { lockRef.current = false; window.dispatchEvent(new Event("curtain:settle-out")); });
  }, [curtainP, runAnim]);

  // Enter section from Hero or About — curtain covers, snap section to viewport, reveal
  const enterSection = useCallback((dir: 1 | -1) => {
    if (lockRef.current) return;
    lockRef.current = true;
    window.dispatchEvent(new Event("curtain:open"));
    if (isMobile()) {
      const el = sectionRef.current;
      if (el) window.scrollTo(0, absTop(el));
      setTimeout(() => { lockRef.current = false; window.dispatchEvent(new Event("curtain:settle-in")); }, 300);
      return;
    }
    curtainP.set(dir > 0 ? -1 : 1);
    runAnim(0).then(() => {
      const el = sectionRef.current;
      if (el) window.scrollTo(0, absTop(el));
      return new Promise<void>(r => setTimeout(r, 80));
    }).then(() => runAnim(dir > 0 ? 1 : -1))
      .then(() => { lockRef.current = false; window.dispatchEvent(new Event("curtain:settle-in")); });
  }, [curtainP, runAnim]);

  useEffect(() => {
    let touchY = 0;

    const onWheel = (e: WheelEvent) => {
      const down = e.deltaY > 0;

      if (isApproaching(down) && !isInSection()) {
        e.preventDefault();
        enterSection(down ? 1 : -1);
        return;
      }
      if (!isInSection()) return;

      e.preventDefault(); // hold the page in place while inside the section
      if (lockRef.current) return;

      const idx = currentRef.current;
      if (down && idx >= N - 1) {
        goExternal(() => {
          const el = document.getElementById("sobre-mi");
          if (el) window.scrollTo(0, absTop(el));
        }, 1);
      } else if (!down && idx <= 0) {
        goExternal(() => window.scrollTo(0, 0), -1);
      } else {
        goTo(idx + (down ? 1 : -1), down ? 1 : -1);
      }
    };

    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isInSection() || lockRef.current) return;
      const delta = touchY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 40) return;
      const down = delta > 0;
      const idx = currentRef.current;
      if (down && idx >= N - 1) goExternal(() => { const el = document.getElementById("sobre-mi"); if (el) window.scrollTo(0, absTop(el)); }, 1);
      else if (!down && idx <= 0) goExternal(() => window.scrollTo(0, 0), -1);
      else goTo(idx + (down ? 1 : -1), down ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!isInSection() || lockRef.current) return;
      const idx = currentRef.current;
      if ((e.key === "ArrowDown" || e.key === "PageDown") && idx < N - 1) { e.preventDefault(); goTo(idx + 1, 1); }
      if ((e.key === "ArrowUp" || e.key === "PageUp") && idx > 0) { e.preventDefault(); goTo(idx - 1, -1); }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [isInSection, isApproaching, enterSection, goTo, goExternal]);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-deep-space">
      <AnimatePresence mode="wait">
        <motion.div
          key={services[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <ServiceSlide service={services[current]} />
        </motion.div>
      </AnimatePresence>

      {/* Curtain — desktop only; on mobile AnimatePresence crossfade handles the transition */}
      <motion.div style={{ y: curtainY }} className="fixed inset-0 z-[49] hidden md:block bg-linear-to-b from-lavender-veil via-[#f0e8f6] to-background pointer-events-none" />

      {/* Progress dots — row on mobile, column on desktop */}
      <nav
        aria-label="Navegación de servicios"
        className="absolute bottom-6 right-4 z-20 flex flex-row gap-2 md:flex-col md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-6 md:gap-2.5"
      >
        {services.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Ir a ${s.title}`}
            onClick={() => { const idx = currentRef.current; if (i !== idx && !lockRef.current) goTo(i, i > idx ? 1 : -1); }}
            className={`rounded-full transition-all duration-500 ${i === current ? "w-4 h-1.5 md:w-1.5 md:h-4 bg-white" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </nav>
    </section>
  );
}
