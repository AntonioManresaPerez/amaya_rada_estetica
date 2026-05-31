# Amaya Rada Estética — Web v2

Reescritura completa del sitio web del centro de estética Amaya Rada (Murcia) sobre **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Sanity CMS**, pensada para SEO local, reservas online reales y panel de administración.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, RSC, ISR) + TypeScript |
| Estilos | Tailwind CSS v4 + shadcn/ui (Base UI) |
| Animaciones | Framer Motion |
| Formularios | react-hook-form + zod |
| CMS | Sanity Studio (embebido en `/studio`) |
| Base de datos (fase 4) | Supabase (Postgres + Auth + Storage) |
| Emails (fase 4) | Resend + React Email |
| Hosting | Vercel |

## Arranque local

```bash
pnpm install
cp .env.local.example .env.local   # rellena las variables
pnpm dev
```

- Web: [http://localhost:3000](http://localhost:3000)
- Panel admin Sanity: [http://localhost:3000/studio](http://localhost:3000/studio)

## Configurar Sanity (una sola vez)

1. Crear cuenta gratuita en [sanity.io](https://www.sanity.io/manage) y un nuevo proyecto (dataset `production`).
2. Copiar el **Project ID** desde el dashboard.
3. Pegarlo en `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
4. En el dashboard de Sanity, añadir `http://localhost:3000` y el dominio de producción a **API > CORS origins** (con credentials).
5. Visitar `/studio`, iniciar sesión y empezar a publicar.

## Estructura

```
.
├── sanity.config.ts          # Config del Studio (schema + plugins)
├── sanity.cli.ts             # Config CLI (sanity deploy, sanity dataset…)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root: lang=es, fuentes, metadata, JSON-LD BeautySalon
│   │   ├── page.tsx          # Home
│   │   ├── globals.css       # Tailwind v4 + paleta beige/charcoal + tokens shadcn
│   │   └── studio/
│   │       └── [[...tool]]/  # Sanity Studio embebido
│   ├── components/
│   │   ├── ui/               # shadcn (button, dialog, input, sheet…)
│   │   └── motion/           # Presets Framer Motion
│   ├── lib/
│   │   ├── utils.ts          # cn() helper
│   │   ├── site-config.ts    # Fallback de contacto/horarios mientras no haya CMS
│   │   └── seo.ts            # buildMetadata() + JSON-LD LocalBusiness
│   └── sanity/
│       ├── env.ts            # Project ID / dataset / apiVersion
│       ├── structure.ts      # Orden del menú del Studio
│       ├── schemas/          # siteSettings, service, serviceCategory, post,
│       │                     #   author, beforeAfter, testimonial
│       └── lib/
│           ├── client.ts     # createClient() de next-sanity
│           ├── image.ts      # urlFor() para imágenes
│           └── queries.ts    # GROQ queries reutilizables
└── .env.local.example
```

## Fases del proyecto

1. ✅ **Cimientos** — Next.js 16, TS, Tailwind v4, shadcn, paleta, fuentes, SEO base.
2. ✅ **CMS** — Sanity Studio embebido, esquemas y queries GROQ.
3. **Marketing pages** — `/servicios/[slug]`, `/galeria`, `/blog/[slug]`, `/contacto` conectados a Sanity.
4. **Reservas** — Supabase + Server Actions + Resend + cron de recordatorios.
5. **SEO técnico** — `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, revalidación ISR vía webhook de Sanity.
6. **Despliegue** — Vercel + dominio + Google Search Console.

Plan completo: `C:\Users\Manre\.claude\plans\dime-que-lenguajes-y-stateful-pelican.md`.
