# CLAUDE.md — Amaya Rada Estética v2

Guías fijas que Claude Code sigue en este proyecto sin excepción.
Ver también: [CLAUDE-SECURITY.md](./CLAUDE-SECURITY.md) y [CLAUDE-SEO.md](./CLAUDE-SEO.md).

---

## Proyecto

Web de centro de estética avanzada (Murcia). Stack: **Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui (Base UI) · Sanity CMS · Supabase · Resend · Vercel**.

---

## Paleta de colores

La paleta oficial del proyecto. **Nunca usar los colores beige anteriores.**

| Token Tailwind | Nombre | Hex | Uso |
|---|---|---|---|
| `lavender-veil` | Lavender Veil | `#e8d7f1` | Fondos claros, secciones alternas |
| `thistle` | Thistle | `#d3bccc` | Bordes suaves, separadores |
| `vintage-lavender` | Vintage Lavender | `#a167a5` | Acentos, botones secundarios, links |
| `indigo-velvet` | Indigo Velvet | `#4a306d` | Color principal de marca, CTAs primarios |
| `deep-space` | Deep Space Blue | `#0e273c` | Textos oscuros, footer, headings hero |

Reglas de uso:
- `#0e273c` sobre `#e8d7f1` o blanco → contraste WCAG AA garantizado.
- `#4a306d` como `--color-primary` en shadcn (fondo de botón principal).
- `#a167a5` como `--color-accent` (hover, tags, badges).
- Nunca usar `#e8d7f1` como fondo de texto oscuro en móvil sin verificar contraste.
- Gradientes permitidos: `from-lavender-veil to-white` y `from-indigo-velvet to-deep-space`.

---

## Mobile-first — prioridad máxima

**Todo componente o cambio visual se diseña primero para móvil y luego se escala a pantallas mayores.**

- Empezar siempre desde el breakpoint base (sin prefijo) y añadir `sm:`, `md:`, `lg:` para ampliar.
- Nunca usar `sm:` o `md:` para "arreglar" móvil — el base ya debe funcionar en móvil.
- Padding/gap/tamaños de fuente: valores menores en base, mayores con prefijo (`py-8 md:py-16`, `gap-6 md:gap-12`).
- Grids: columna única en base, ampliar en breakpoints (`grid-cols-1 md:grid-cols-3`), nunca al revés.
- Texto largo (emails, URLs, nombres): `break-all` o `truncate` para evitar desbordamiento en pantallas estrechas.
- Touch targets mínimo 44×44 px en móvil (`min-h-11 min-w-11`).
- Antes de dar una tarea por terminada, revisar mentalmente cómo se ve en 375 px de ancho.

---

## Reglas fijas de desarrollo

1. **TypeScript estricto** — `strict: true` en tsconfig. Nunca usar `any` ni `@ts-ignore` sin comentario de justificación.
2. **Sin datos hardcodeados en componentes** — textos, precios, horarios y contacto siempre desde `siteConfig` o Sanity. Excepción: fallback de error.
3. **Cada archivo < 200 líneas** — si crece más, refactorizar en subcomponentes o hooks.
4. **Server Components por defecto** — `"use client"` solo cuando se necesite estado, ref o eventos del navegador.
5. **Imágenes siempre con `next/image`** — nunca `<img>` sin `width`/`height` y `alt`. AVIF/WebP automático.
6. **Vídeos con `preload="metadata"`** y `muted autoPlay loop playsInline`. Nunca `preload="auto"`.
7. **Sin dependencias nuevas sin justificar** — antes de añadir un paquete, verificar si Next/React/shadcn ya lo cubren.
8. **Commits atómicos** — un commit por feature/fix. Nunca subir `.env.local` ni claves.
9. **Paleta aplicada vía tokens CSS** — nunca colores literales en `className` (`#a167a5`), siempre `text-vintage-lavender`.
10. **Accesibilidad AA mínima** — todos los elementos interactivos con `focus-visible`, `aria-label` en iconos sin texto, contraste ≥ 4.5:1.

---

## Fluidez y UX — sin cortes visibles

Prioridad máxima: la web debe sentirse como una aplicación nativa, no como páginas que cargan.

### Carga inicial
- `loading="eager"` + `priority` en `next/image` para imágenes above-the-fold.
- `<link rel="preload">` del vídeo hero generado en el layout.
- Fuentes con `display: swap` y `preconnect` a fonts.googleapis.com.
- Suspense boundaries con **skeleton** del mismo tamaño que el contenido real, nunca spinners sueltos.

### Transiciones entre páginas
- Usar `framer-motion` `AnimatePresence` en el layout raíz con `mode="wait"`.
- Variante por defecto: `fadeUp` (opacity 0→1, y 20px→0, 0.35 s ease-out).
- Nunca animaciones > 0.5 s en rutas de navegación principal.
- Scroll restaurado a top en cada navegación: `scrollRestoration: "manual"` en `next.config.ts`.

### Scroll y secciones
- Scroll suave global: `html { scroll-behavior: smooth }`.
- Secciones animadas con `whileInView` de Framer Motion + `once: true` (no reanimar al volver).
- `IntersectionObserver` threshold 0.15 para disparar animaciones antes de que el elemento sea visible.

### Código
- Todas las rutas dinámicas con `generateStaticParams` + ISR (`revalidate: 3600`).
- `React.lazy` + `Suspense` para secciones pesadas (galería, mapa).
- Nunca bloquear el hilo principal > 50 ms (Long Tasks en Lighthouse).

---

## Mis recomendaciones adicionales

Aspectos que marcan la diferencia en una web de estética:

1. **Favicon y PWA manifest** — icono de 512×512 con la `V` del logo o símbolo de flor en `#4a306d`. Añadir `manifest.json` para "Añadir a pantalla de inicio" en móvil (gratis, mejora retención).
2. **Dark mode opcional** — la paleta púrpura funciona muy bien en dark. Activar con `prefers-color-scheme` y toggle manual guardado en `localStorage`.
3. **WhatsApp con mensaje predefinido** — no abrir chat vacío; la URL debe incluir el texto: `?text=Hola%20Amaya%2C%20me%20gustaría%20informarme%20sobre...` con el servicio pre-cargado según la página desde donde se pulse.
4. **Google Maps embed estático** — no usar la API JS (carga pesada); incrustar el iframe estático de maps con `loading="lazy"`. Para el schema LocalBusiness ya tenemos coordenadas.
5. **Banner de cookies mínimo** — analytics first-party (Vercel) no requiere consentimiento explícito en la UE. Si se usa GA4, añadir consentimiento; si no, evitar GA4 por simplicidad.
6. **Error 404 personalizada** — con logo, mensaje en tono de marca y botón de volver a home. No dejar la 404 por defecto de Next.
7. **`robots.txt` que bloquee `/studio`** — el panel admin nunca debe aparecer en Google.
8. **Imágenes de clientes con watermark** — en la galería antes/después, añadir marca de agua discreta con el logo antes de subir a Sanity (Cloudinary transformation).
9. **Lazy load del mapa y del Studio** — el bundle de Sanity Studio es grande; el `[[...tool]]/layout.tsx` ya tiene `force-static`, pero asegurarse de que no se incluye en el bundle de marketing.
10. **Métricas reales** — conectar Vercel Speed Insights + Vercel Analytics desde el primer deploy. Revisar Web Vitals semanalmente los primeros 3 meses.
