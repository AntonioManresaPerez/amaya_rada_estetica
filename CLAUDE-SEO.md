# CLAUDE-SEO.md — SEO

Reglas de SEO. Objetivo: aparecer en el top 3 de Google Murcia para búsquedas de estética facial, dermapen, láser y tratamientos corporales.

---

## Metadata por página

Usar **siempre** `buildMetadata()` de `src/lib/seo.ts`. Nunca hardcodear `<title>` fuera del helper.

| Página | title (< 60 chars) | description (< 155 chars) |
|---|---|---|
| Home | `Amaya Rada Estética · Murcia` | `Centro de estética avanzada en Murcia: facial, dermapen, láser, masajes y pedicura. Reserva online.` |
| Servicio | `{Nombre servicio} en Murcia · Amaya Rada` | Descripción corta del servicio + CTA |
| Blog post | `{Título post} · Amaya Rada Estética` | Primer párrafo del post |
| Galería | `Resultados Reales · Galería Antes/Después · Amaya Rada` | |
| Contacto | `Contacto y Horarios · Amaya Rada Estética Murcia` | Dirección, teléfono y horario |

Reglas:
- `lang="es"` en `<html>` — ya configurado en `layout.tsx`.
- `<link rel="canonical">` en cada página — generado por `buildMetadata()`.
- Cada página tiene su propia `description` distinta. Nunca duplicar.
- `noIndex: true` para `/studio`, `/reservar/confirmacion` (páginas transaccionales).

---

## Open Graph y Twitter Card

En cada página con imagen destacada incluir en `buildMetadata()`:
- `ogImage`: URL absoluta de la imagen (mínimo 1200×630 px, ratio 1.91:1).
- Para servicios: la imagen del servicio desde Sanity con `urlFor().width(1200).height(630)`.
- Para posts: `coverImage` del post.
- Para el resto: `opengraph-image.tsx` generado dinámico con el logo y el nombre del centro.

---

## Schema.org (JSON-LD)

### Root layout (todas las páginas)
`BeautySalon` ya inyectado en `layout.tsx` con `localBusinessJsonLd()`. Incluye:
- `name`, `url`, `telephone`, `email`, `address`, `geo`, `openingHoursSpecification`, `sameAs`.

### Por página de servicio
Añadir `Service` + `Offer` dentro del `<head>` de `/servicios/[slug]/page.tsx`:
```json
{
  "@type": "Service",
  "name": "Higiene Facial Profunda",
  "provider": { "@id": "https://amayarada.es#business" },
  "areaServed": "Murcia",
  "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "65" }
}
```

### Por post de blog
`Article` schema con `headline`, `author`, `datePublished`, `dateModified`, `image`.

### FAQ en servicios
Si el servicio tiene FAQ en Sanity, generar `FAQPage` schema. Alta probabilidad de rich snippet.

---

## URLs y estructura

- **Slugs en español y descriptivos**: `/servicios/dermapen-murcia`, `/blog/limpieza-facial-profunda-beneficios`.
- **Sin `index.html`** en las URLs — Next App Router ya lo maneja.
- **Rutas canónicas sin trailing slash** — configurar `trailingSlash: false` en `next.config.ts`.
- Breadcrumbs visibles en `/servicios/[slug]` y `/blog/[slug]` + schema `BreadcrumbList`.

---

## Sitemap y robots

`src/app/sitemap.ts` — generado dinámicamente, incluir:
- `/` con `priority: 1.0`, `changeFrequency: weekly`.
- `/servicios/[slug]` con `priority: 0.9`, `changeFrequency: monthly`.
- `/galeria` con `priority: 0.8`.
- `/blog/[slug]` con `priority: 0.7`, `changeFrequency: weekly`.
- `/contacto` con `priority: 0.6`.
- Excluir: `/studio/**`, `/reservar/confirmacion`, `/privacidad`, `/cookies`.

`src/app/robots.ts`:
```ts
Disallow: /studio
Disallow: /reservar/confirmacion
Allow: /
Sitemap: https://amayarada.es/sitemap.xml
```

---

## Performance como factor SEO

Google usa Core Web Vitals como señal de ranking. Objetivos:

| Métrica | Objetivo | Cómo |
|---|---|---|
| LCP | < 2.0 s | `priority` en imagen hero, preload del vídeo |
| INP | < 200 ms | Server Components, minimal JS cliente |
| CLS | < 0.05 | `width`/`height` en todas las imágenes, skeleton del mismo tamaño |
| TTFB | < 600 ms | ISR + CDN Vercel Edge Network |

Ejecutar Lighthouse CI en cada deploy (Vercel lo integra automáticamente).

---

## SEO local (Google Business)

- Registrar / reclamar el perfil de **Google Business** con la misma dirección del schema.
- Asegurarse de que el número de teléfono, horario y nombre del negocio son idénticos en: web, Google Business, schema.org, y Sanity `siteSettings`.
- Añadir la URL de Google Business en `siteConfig.social.google` y en el schema `sameAs`.
- Las reseñas de Google Business son el activo SEO local más valioso. Incluir CTA "Déjanos tu reseña" en el email de confirmación de reserva.

---

## Contenido del blog (estrategia long-tail)

Primeros 6 posts recomendados (búsquedas con intención transaccional o informacional en Murcia):

1. "Qué es el dermapen y para qué sirve" — informacional.
2. "Higiene facial profunda: beneficios y diferencias con limpieza básica" — informacional.
3. "Depilación láser en Murcia: todo lo que necesitas saber" — transaccional local.
4. "Cuántas sesiones de dermapen se necesitan para ver resultados" — long-tail FAQ.
5. "Tratamientos corporales para celulitis: guía completa" — informacional.
6. "Cuánto cuesta una limpieza facial en Murcia en 2025" — transaccional.

Cada post: mínimo 800 palabras, H1 único, H2 con keywords, imagen principal con `alt` descriptivo, enlace interno a la página del servicio correspondiente.

---

## Checklist pre-deploy SEO

- [ ] `pnpm build` sin warnings de metadata.
- [ ] Validar JSON-LD en [schema.org/validator](https://validator.schema.org).
- [ ] Validar rich results en [Google Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Sitemap accesible en `/sitemap.xml`.
- [ ] Robots.txt bloquea `/studio`.
- [ ] Open Graph preview en [opengraph.xyz](https://www.opengraph.xyz) para home, un servicio y un post.
- [ ] Lighthouse móvil ≥ 90 en las 4 métricas.
- [ ] Enviar sitemap a Google Search Console tras el primer deploy.
