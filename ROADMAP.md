# ROADMAP — Amaya Rada Estética

Backlog de mejoras priorizadas tras el análisis crítico de la web (pre-lanzamiento).
Orden recomendado: **A → (foto real de C en paralelo) → B → resto de C → D**.

Estado de la web: producto maduro (reserva online real con Supabase + Resend + cron de
recordatorios, Sanity CMS, SEO con JSON-LD, RGPD, accesibilidad, sistema visual con tokens
de marca). Lo que falta es **blindaje de lanzamiento + medición**, **palancas de
confianza/venta del sector estético** y **autenticidad visual** (foto real vs stock).

Leyenda: `[ ]` pendiente · `[x]` hecho · (P0) crítico · (P1) alto · (P2) deseable.

---

## Frente A — Cimientos de lanzamiento (P0)
Barato, bajo riesgo, momento ideal antes de tener tráfico.

- [ ] Cabeceras de seguridad en `next.config.ts` (HSTS, X-Content-Type-Options, Referrer-Policy,
      X-Frame-Options: SAMEORIGIN, Permissions-Policy) + **CSP solo en producción** y **solo en
      rutas no-Studio** (`source: "/((?!studio).*)"`).
- [ ] Vercel Analytics + Speed Insights (`@vercel/analytics`, `@vercel/speed-insights`) montados
      en `src/app/layout.tsx`.
- [ ] Favicon + PWA: `src/app/icon.svg`, `src/app/apple-icon.tsx`, `src/app/manifest.ts`
      (theme `#4a306d`, bg `#f9f5fc`). Limpiar boilerplate de `public/`.
- [ ] Honeypot anti-bot (campo `website`) en el formulario de reserva + corte silencioso en la
      server action `createReservation`.

### Follow-ups del Frente A
- [ ] Exportar `public/icon-192.png` y `icon-512.png` (maskable) del SVG y añadirlos al manifest
      (necesario para instalación PWA completa).
- [ ] Migrar el rate-limit en memoria de `src/actions/reservations.ts` → Upstash Redis
      (requiere cuenta + variables de entorno).
- [ ] CSP basada en `nonce` en lugar de `'unsafe-inline'` (post-lanzamiento).

---

## Frente B — Conversión y confianza (sector estética) (P1)

- [ ] Reseñas de Google visibles + `aggregateRating` en el JSON-LD (estrellas en el buscador).
- [ ] Precios visibles en las tarjetas de servicio (hoy solo aparecen dentro del formulario de
      reserva).
- [ ] Bonos / packs de sesiones (p. ej. "5 sesiones −15 %") y **tarjetas regalo**.
- [ ] Seña/depósito anti-no-show (Stripe) en tratamientos caros (opcional).
- [ ] CTA "Reservar" fija en móvil (barra inferior) y "primera consulta gratuita" más prominente.
- [ ] Confirmación por WhatsApp además de por email.

---

## Frente C — Riqueza visual y autenticidad (P1/P2)

- [ ] **Sustituir el stock de Pexels por fotografía real** de Amaya y del centro
      (mayor impacto visual; requiere material). Mantener stock solo como fallback.
- [ ] Páginas de servicio más ricas: proceso paso a paso, beneficios, resultados/tiempos
      esperados, contraindicaciones (el schema de Sanity ya lo soporta), tratamientos relacionados.
- [ ] Galería antes/después con **marca de agua** (el flujo de consentimiento ya existe).
- [ ] **Decidir dark mode**: activar (toggle + `localStorage` + `prefers-color-scheme`) o retirar
      el CSS `.dark` que hoy no se usa.
- [ ] Feed de Instagram (se enlaza en el footer pero no se muestra).

---

## Frente D — SEO y contenido (P2)

- [ ] `BreadcrumbList` JSON-LD en `/servicios/[slug]` y `/blog/[slug]` (las migas se pintan sin schema).
- [ ] Sembrar contenido en Sanity: blog, testimonios y galería (hoy vacíos → "próximamente").
- [ ] FAQ en la home.
- [ ] Google Business Profile en `sameAs` del schema.

---

## Frente E — Pulido técnico (P2)

- [ ] Tarjetas de servicio del `BookingForm` con `next/image` en vez de `<img>`.
- [ ] Animaciones de entrada de Framer Motion que respeten `prefers-reduced-motion` a nivel de
      componente (la decoración CSS ya está cubierta).
