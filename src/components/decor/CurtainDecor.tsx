"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { FloatingPetals } from "@/components/decor/FloatingPetals";

// Decorado del telón de transición: aurora viva (cuya disposición de colores
// cambia en cada transición → nunca igual), destello de seda, chispas que
// titilan y pétalos de cerezo. Capa interna del telón, no interactiva.

// Solo tonos pastel suaves → la transición siempre queda tenue, nunca un color fuerte.
const AURA_COLORS = ["#e8d7f1", "#d3bccc", "#ecd9f2", "#e3cfe6", "#f3e1ee", "#dcc6e0"];
const AURA_ANIMS = ["hero-aura-1", "hero-aura-2", "hero-aura-3"];

type Blob = { left: string; top: string; size: number; color: string; anim: string; dur: number; opacity: number };

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function makeBlobs(): Blob[] {
  return Array.from({ length: 3 }, () => ({
    left: `${Math.round(rand(-18, 60))}%`,
    top: `${Math.round(rand(-22, 56))}%`,
    size: Math.round(rand(46, 68)),
    color: pick(AURA_COLORS),
    anim: pick(AURA_ANIMS),
    dur: Math.round(rand(14, 22)),
    opacity: +rand(0.28, 0.46).toFixed(2),
  }));
}

// Disposición inicial fija (evita desajuste de hidratación); se aleatoriza al montar.
const DEFAULT_BLOBS: Blob[] = [
  { left: "-12%", top: "-16%", size: 62, color: "#e8d7f1", anim: "hero-aura-1", dur: 15, opacity: 0.4 },
  { left: "58%", top: "48%", size: 66, color: "#d3bccc", anim: "hero-aura-2", dur: 18, opacity: 0.36 },
  { left: "30%", top: "18%", size: 50, color: "#ecd9f2", anim: "hero-aura-3", dur: 20, opacity: 0.4 },
];

const SPARKLES: { top: string; left: string; size: number; dur: number; delay: number; o: number }[] = [
  { top: "12%", left: "10%", size: 10, dur: 2.6, delay: 0.0, o: 0.9 },
  { top: "22%", left: "82%", size: 8,  dur: 3.1, delay: 0.6, o: 0.8 },
  { top: "34%", left: "26%", size: 12, dur: 2.2, delay: 1.1, o: 1.0 },
  { top: "18%", left: "54%", size: 7,  dur: 3.4, delay: 0.3, o: 0.75 },
  { top: "46%", left: "70%", size: 9,  dur: 2.8, delay: 1.5, o: 0.85 },
  { top: "58%", left: "16%", size: 11, dur: 2.4, delay: 0.9, o: 0.95 },
  { top: "40%", left: "44%", size: 6,  dur: 3.6, delay: 1.8, o: 0.7 },
  { top: "66%", left: "60%", size: 10, dur: 2.7, delay: 0.4, o: 0.9 },
  { top: "72%", left: "34%", size: 8,  dur: 3.0, delay: 1.3, o: 0.8 },
  { top: "28%", left: "92%", size: 7,  dur: 3.3, delay: 0.7, o: 0.75 },
  { top: "80%", left: "78%", size: 9,  dur: 2.5, delay: 1.6, o: 0.85 },
  { top: "8%",  left: "38%", size: 6,  dur: 3.5, delay: 2.0, o: 0.7 },
  { top: "52%", left: "88%", size: 11, dur: 2.3, delay: 1.0, o: 0.95 },
  { top: "62%", left: "48%", size: 7,  dur: 3.2, delay: 0.2, o: 0.75 },
  { top: "86%", left: "20%", size: 9,  dur: 2.9, delay: 1.4, o: 0.85 },
  { top: "16%", left: "66%", size: 8,  dur: 3.0, delay: 0.5, o: 0.8 },
];

export function CurtainDecor() {
  const [blobs, setBlobs] = useState<Blob[]>(DEFAULT_BLOBS);

  useEffect(() => {
    setBlobs(makeBlobs());
    const onOpen = () => setBlobs(makeBlobs());
    window.addEventListener("curtain:open", onOpen);
    return () => window.removeEventListener("curtain:open", onOpen);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden motion-reduce:hidden">
      {/* Aurora — posición y color cambian en cada transición */}
      {blobs.map((b, i) => (
        <span
          key={i}
          className="curtain-aura"
          style={{
            left: b.left,
            top: b.top,
            width: `${b.size}vw`,
            height: `${b.size}vw`,
            opacity: b.opacity,
            background: `radial-gradient(circle, ${b.color}, transparent 68%)`,
            animation: `${b.anim} ${b.dur}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Pétalos de cerezo (mismo motivo que el resto de la web) */}
      <FloatingPetals />

      {/* Chispas que titilan */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="curtain-sparkle"
          style={
            {
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
              "--tw-o": s.o,
            } as CSSProperties
          }
        />
      ))}

      {/* Destello de seda por encima de todo */}
      <span className="curtain-sheen" />
    </div>
  );
}
