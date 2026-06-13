import type { NextConfig } from "next";
import path from "node:path";

// Cabeceras de seguridad aplicadas en todas las rutas.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // SAMEORIGIN (no DENY): Sanity Studio en /studio usa iframes mismo-origen.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

// CSP solo para rutas no-Studio (Studio necesita 'unsafe-eval'/blob:/ws:).
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  // 'unsafe-inline': JSON-LD inline + bootstrap de Next; va: Vercel Analytics.
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  // 'unsafe-inline': estilos inline de Tailwind v4 + Framer Motion.
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://images.pexels.com",
  "connect-src 'self' https://*.sanity.io https://*.apicdn.sanity.io https://*.supabase.co https://vitals.vercel-insights.com",
  "frame-src https://www.google.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async headers() {
    // CSP solo en producción: en dev rompería el HMR de Turbopack ('unsafe-eval'/ws:).
    const nonStudio = [...securityHeaders];
    if (process.env.NODE_ENV === "production") {
      nonStudio.push({ key: "Content-Security-Policy", value: csp });
    }
    return [
      // Todo menos /studio: cabeceras + CSP (en prod).
      { source: "/((?!studio).*)", headers: nonStudio },
      // /studio: solo las cabeceras base, sin CSP.
      { source: "/studio/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
