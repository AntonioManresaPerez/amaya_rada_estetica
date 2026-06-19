"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

// Partículas lavanda que reaccionan a la velocidad del scroll: derivan y giran
// cuando avanzas rápido y se asientan al detenerte. Solo decorativo.
const PETALS = [
  { left: "12%", top: "22%", size: 10, op: 0.25, factor: 1 },
  { left: "82%", top: "30%", size: 7, op: 0.2, factor: -1.3 },
  { left: "24%", top: "70%", size: 12, op: 0.18, factor: 0.8 },
  { left: "70%", top: "66%", size: 9, op: 0.22, factor: -0.9 },
  { left: "50%", top: "15%", size: 6, op: 0.16, factor: 1.4 },
  { left: "60%", top: "82%", size: 8, op: 0.2, factor: -1.1 },
];

export function Atmosphere({ velocity }: { velocity: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {PETALS.map((p, i) => (
        <Petal key={i} p={p} velocity={velocity} />
      ))}
    </div>
  );
}

function Petal({ p, velocity }: { p: (typeof PETALS)[number]; velocity: MotionValue<number> }) {
  const y = useTransform(velocity, (v) => v * 40 * p.factor);
  const rotate = useTransform(velocity, (v) => v * 25 * p.factor);
  return (
    <motion.span
      className="absolute rounded-full bg-lavender-veil blur-[1px]"
      style={{ left: p.left, top: p.top, width: p.size, height: p.size, opacity: p.op, y, rotate }}
    />
  );
}
