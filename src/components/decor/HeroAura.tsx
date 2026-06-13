import type { CSSProperties } from "react";

// Fondo premium del hero: aurora de blobs vivos, orbes de luz que ascienden y
// un foco que sigue al cursor. Reacciona al ratón vía --mx/--my/--px/--py
// (fijadas por la sección). Capa decorativa no interactiva.

const ORBS: { left: string; size: number; dur: number; delay: number; o: number }[] = [
  { left: "8%",  size: 13, dur: 11, delay: 0, o: 0.7 },
  { left: "16%", size: 8,  dur: 15, delay: 3, o: 0.55 },
  { left: "24%", size: 18, dur: 9,  delay: 6, o: 0.8 },
  { left: "33%", size: 10, dur: 13, delay: 1, o: 0.6 },
  { left: "42%", size: 7,  dur: 17, delay: 8, o: 0.5 },
  { left: "50%", size: 15, dur: 10, delay: 4, o: 0.75 },
  { left: "59%", size: 9,  dur: 14, delay: 2, o: 0.6 },
  { left: "67%", size: 20, dur: 8,  delay: 7, o: 0.8 },
  { left: "75%", size: 8,  dur: 16, delay: 5, o: 0.55 },
  { left: "84%", size: 14, dur: 12, delay: 9, o: 0.7 },
  { left: "91%", size: 10, dur: 13, delay: 3, o: 0.6 },
  { left: "97%", size: 7,  dur: 18, delay: 6, o: 0.5 },
];

export function HeroAura({ hasVideo }: { hasVideo: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden motion-reduce:hidden"
      style={
        {
          transform: "translate3d(calc(var(--px, 0) * 20px), calc(var(--py, 0) * 20px), 0)",
          transition: "transform 300ms ease-out",
        } as CSSProperties
      }
    >
      {!hasVideo && (
        <>
          <span className="hero-aura hero-aura-1" />
          <span className="hero-aura hero-aura-2" />
          <span className="hero-aura hero-aura-3" />
        </>
      )}

      {ORBS.map((o, i) => (
        <span
          key={i}
          className="hero-orb"
          style={
            {
              left: o.left,
              width: o.size,
              height: o.size,
              animationDuration: `${o.dur}s`,
              animationDelay: `${o.delay}s`,
              "--orb-o": o.o,
            } as CSSProperties
          }
        />
      ))}

      <span className="hero-spotlight" />
    </div>
  );
}
