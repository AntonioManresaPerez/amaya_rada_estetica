import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    lang: "es-ES",
    theme_color: "#4a306d",
    background_color: "#f9f5fc",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      // PNG 192/512 maskable pendientes (exportar del SVG) → ver ROADMAP.
    ],
  };
}
