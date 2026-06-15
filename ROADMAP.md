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

- [x] Reseñas de Google + `aggregateRating` en el JSON-LD: mecanismo listo. **Falta** rellenar
      `siteConfig.reviews` (rating, count, url) con datos reales para activar estrellas + badge.
- [x] Precios visibles en las tarjetas de servicio (`/servicios` ya muestra "Desde X€" + duración).
      **Falta** rellenar el precio de cada servicio en Sanity.
- [x] CTA "Reservar" fija en móvil (barra inferior en páginas internas).
- [x] "Primera consulta gratuita" destacada (distintivo en la sección de reserva).
- [x] Bonos / packs de sesiones y **tarjetas regalo**: sección en `/servicios` con
      packs de ejemplo (editables en Sanity → "Bonos y tarjetas regalo"). Visibilidad
      controlada desde Sanity Studio con el interruptor **Ajustes → Bonos → "Mostrar
      sección"** (apagado por defecto = oculto al público). Admin = login de Sanity.
      **Follow-up opcional**: vista previa en vivo mientras está oculto (Next draft mode).
- [x] Métricas: Vercel Analytics + Speed Insights (panel de Vercel) + tracking de clicks
      `whatsapp_click`, `reserva_click`, `bono_whatsapp_click`.
- [ ] Seña/depósito anti-no-show (Stripe) en tratamientos caros (requiere cuenta Stripe).
- [ ] Confirmación por WhatsApp automatizada además de por email (requiere WhatsApp Business API).
- [ ] (Opcional) Panel de administrador propio con login/roles (Supabase Auth) — solo si
      se quiere todo bajo un único login (p. ej. zona de cliente). Hoy: admin = Sanity Studio.

---

## Frente C — Riqueza visual y autenticidad (P1/P2)

- [ ] **Sustituir el stock de Pexels por fotografía real** de Amaya y del centro
      (mayor impacto visual; **requiere material del usuario**). El sistema ya usa imagen de
      Sanity con fallback a stock: basta subir fotos a cada servicio en Studio y reemplazar
      `public/amaya-rada.webp`.
- [x] Páginas de servicio más ricas: descripción detallada, **beneficios**, **cómo es la sesión
      (pasos)**, galería, contraindicaciones y **tratamientos relacionados** (auto por categoría).
      Beneficios y pasos son campos nuevos en Sanity → rellenar por servicio.
- [x] Galería antes/después con **marca de agua** discreta (overlay). *Follow-up opcional*: marca
      de agua incrustada en el fichero (Cloudinary) para que no se pueda recortar.
- [x] **Dark mode**: decidido **retirarlo**. Eliminado el bloque `.dark` de `globals.css`; la web
      queda en tema claro lavanda. (`@custom-variant dark` se mantiene → utilidades `dark:` inertes.)
- [ ] Feed de Instagram (requiere token de la API de Instagram o un widget de terceros; alternativa:
      sección "Síguenos" con imágenes curadas que enlazan al perfil).

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
