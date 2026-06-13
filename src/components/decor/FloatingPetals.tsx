import type { CSSProperties } from "react";

// Pétalos de cerezo realistas. Animación 100% CSS (transform/opacity → GPU):
// el exterior cae y se balancea, el interior voltea en 3D. Capa de fondo no interactiva.
type Petal = {
  left: string;
  size: number;
  duration: number; // tiempo de caída (s)
  delay: number;
  sway: number; // amplitud de balanceo (px)
  o: number; // opacidad máxima
  spin: number; // duración del volteo 3D (s)
  tilt: number; // inclinación base (deg)
  blur: number; // desenfoque → profundidad
  grad: "A" | "B" | "C";
  shape: "A" | "B";
};

const PETALS: Petal[] = [
  { left: "3%",  size: 26, duration: 13, delay: 0,  sway: 64, o: 0.95, spin: 4.5, tilt: -10, blur: 0,   grad: "A", shape: "A" },
  { left: "9%",  size: 14, duration: 18, delay: 4,  sway: 40, o: 0.7,  spin: 6,   tilt: 8,   blur: 1.2, grad: "C", shape: "B" },
  { left: "16%", size: 32, duration: 11, delay: 7,  sway: 78, o: 1,    spin: 3.8, tilt: -14, blur: 0,   grad: "B", shape: "A" },
  { left: "23%", size: 12, duration: 21, delay: 2,  sway: 35, o: 0.55, spin: 7,   tilt: 5,   blur: 1.7, grad: "A", shape: "B" },
  { left: "30%", size: 20, duration: 15, delay: 9,  sway: 55, o: 0.9,  spin: 5,   tilt: -6,  blur: 0.4, grad: "C", shape: "A" },
  { left: "37%", size: 16, duration: 17, delay: 5,  sway: 48, o: 0.8,  spin: 5.5, tilt: 12,  blur: 0.8, grad: "B", shape: "B" },
  { left: "44%", size: 29, duration: 12, delay: 11, sway: 72, o: 0.95, spin: 4,   tilt: -12, blur: 0,   grad: "A", shape: "A" },
  { left: "50%", size: 11, duration: 22, delay: 1,  sway: 30, o: 0.5,  spin: 7.5, tilt: 6,   blur: 1.9, grad: "C", shape: "B" },
  { left: "57%", size: 22, duration: 14, delay: 8,  sway: 60, o: 0.9,  spin: 4.8, tilt: -8,  blur: 0.3, grad: "B", shape: "A" },
  { left: "64%", size: 15, duration: 19, delay: 3,  sway: 42, o: 0.7,  spin: 6.2, tilt: 10,  blur: 1.1, grad: "A", shape: "B" },
  { left: "71%", size: 28, duration: 12, delay: 6,  sway: 70, o: 1,    spin: 4.2, tilt: -11, blur: 0,   grad: "C", shape: "A" },
  { left: "78%", size: 13, duration: 20, delay: 10, sway: 36, o: 0.55, spin: 7,   tilt: 7,   blur: 1.6, grad: "B", shape: "B" },
  { left: "85%", size: 24, duration: 13, delay: 13, sway: 62, o: 0.92, spin: 4.6, tilt: -9,  blur: 0,   grad: "A", shape: "A" },
  { left: "91%", size: 17, duration: 16, delay: 4,  sway: 50, o: 0.8,  spin: 5.6, tilt: 9,   blur: 0.7, grad: "C", shape: "B" },
  { left: "96%", size: 12, duration: 21, delay: 8,  sway: 32, o: 0.55, spin: 7.2, tilt: 6,   blur: 1.7, grad: "B", shape: "B" },
  { left: "27%", size: 19, duration: 16, delay: 15, sway: 52, o: 0.85, spin: 5.3, tilt: -7,  blur: 0.5, grad: "B", shape: "A" },
  { left: "60%", size: 18, duration: 15, delay: 17, sway: 54, o: 0.82, spin: 5.1, tilt: 11,  blur: 0.6, grad: "A", shape: "A" },
  { left: "82%", size: 13, duration: 19, delay: 12, sway: 38, o: 0.6,  spin: 6.8, tilt: -5,  blur: 1.4, grad: "C", shape: "B" },
];

// Dos siluetas: A = pétalo de cerezo con muesca · B = pétalo más redondeado.
const PETAL_PATHS = {
  A: "M50 138 C 22 116, 6 78, 16 40 C 22 18, 40 12, 50 30 C 60 12, 78 18, 84 40 C 94 78, 78 116, 50 138 Z",
  B: "M50 134 C 24 124, 8 92, 16 54 C 22 24, 42 16, 50 28 C 58 16, 78 24, 84 54 C 92 92, 76 124, 50 134 Z",
} as const;

function PetalShape({ grad, shape }: { grad: Petal["grad"]; shape: Petal["shape"] }) {
  const d = PETAL_PATHS[shape];
  return (
    <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
      <path d={d} fill={`url(#petalGrad${grad})`} />
      {/* Brillo translúcido (la luz atraviesa el pétalo) */}
      <path d={d} fill="url(#petalSheen)" />
      {/* Nervio central */}
      <path d="M50 132 C 47 95, 49 58, 50 32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function FloatingPetals() {
  return (
    <div
      aria-hidden
      className="petal-field pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
    >
      {/* Degradados compartidos (tonos cerezo, ligeramente malva para encajar con la paleta) */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="petalGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde3ef" />
            <stop offset="55%" stopColor="#f4b8d5" />
            <stop offset="100%" stopColor="#e58fbe" />
          </linearGradient>
          <linearGradient id="petalGradB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff0f6" />
            <stop offset="50%" stopColor="#f6c9de" />
            <stop offset="100%" stopColor="#eca6cb" />
          </linearGradient>
          <linearGradient id="petalGradC" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f6e0f0" />
            <stop offset="50%" stopColor="#e7b6d6" />
            <stop offset="100%" stopColor="#cf95c4" />
          </linearGradient>
          <radialGradient id="petalSheen" cx="36%" cy="26%" r="58%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
      </svg>

      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal-fall"
          style={
            {
              left: p.left,
              width: p.size,
              height: Math.round(p.size * 1.3),
              filter: p.blur ? `blur(${p.blur}px)` : undefined,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--sway": `${p.sway}px`,
              "--petal-o": p.o,
            } as CSSProperties
          }
        >
          <span
            className="petal-spin"
            style={
              {
                animationDuration: `${p.spin}s`,
                "--tilt": `${p.tilt}deg`,
              } as CSSProperties
            }
          >
            <PetalShape grad={p.grad} shape={p.shape} />
          </span>
        </span>
      ))}
    </div>
  );
}
