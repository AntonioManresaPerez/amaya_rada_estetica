import { siteConfig } from "@/lib/site-config";
import { pexels } from "@/lib/service-photos";

// Handle derivado de la URL del perfil → "@amaya_rada_estetica".
export const instagramHandle =
  siteConfig.social.instagram.replace(/\/+$/, "").split("/").pop() ?? "";

export interface InstagramPost {
  src: string; // imagen del mosaico
  alt: string; // descripción para accesibilidad
}

// Mosaico "Síguenos en Instagram". Son PLACEHOLDERS (stock) para la maqueta:
// cuando tengas tus fotos reales, sustituye cada `src` por la tuya (súbela a
// /public o usa una URL de Sanity) y ajusta el `alt`. Cada foto enlaza al perfil.
export const DEFAULT_INSTAGRAM_POSTS: InstagramPost[] = [
  { src: pexels(8312823, 600, 600), alt: "Tratamiento facial en cabina" },
  { src: pexels(6628815, 600, 600), alt: "Masaje facial relajante" },
  { src: pexels(5701545, 600, 600), alt: "Valoración personalizada de la piel" },
  { src: pexels(5659020, 600, 600), alt: "Sesión de maderoterapia facial" },
  { src: pexels(30809943, 600, 600), alt: "Higiene facial profunda" },
  { src: pexels(36930299, 600, 600), alt: "Detalle de un peeling facial" },
];
