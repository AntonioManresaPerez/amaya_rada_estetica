# CLAUDE-SECURITY.md — Seguridad

Reglas de seguridad obligatorias. Cualquier PR que las incumpla se bloquea antes de mergear.

---

## Variables de entorno

- **Nunca** exponer tokens con `NEXT_PUBLIC_` si no son estrictamente públicos.
  - ✅ Público: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
  - ❌ Nunca público: `SANITY_API_READ_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`
- El `SUPABASE_SERVICE_ROLE_KEY` solo se usa en **Server Actions** y **Route Handlers**, nunca en Client Components.
- `.env.local` está en `.gitignore`. Si aparece en `git status`, abortar el commit.
- En Vercel, las variables de servidor van en "Environment Variables" sin el prefijo `NEXT_PUBLIC_`.

---

## Formularios y Server Actions

- **Validación Zod en servidor**: toda entrada de usuario se valida con `zod.safeParse()` antes de tocar la BD, aunque el cliente ya la haya validado.
- **Rate limiting en endpoints sensibles** (reservas, contacto): usar Upstash Redis free tier con `@upstash/ratelimit`. Límite: 5 req/IP/15 min en `/api/reservations`, 3 req/IP/10 min en `/api/contact`.
- **Honeypot anti-bot**: campo oculto `name="website"` en todos los formularios. Si viene relleno, rechazar silenciosamente (HTTP 200 sin procesar).
- **CSRF**: Next.js App Router Server Actions tienen protección CSRF nativa (Origin header check). No añadir tokens manuales; no debilitar con `headers: { 'Content-Type': 'text/plain' }`.
- **Nunca** construir queries SQL con interpolación de string. Usar el cliente Supabase tipado.

---

## Headers HTTP de seguridad

Añadir en `next.config.ts` vía `headers()`:

```ts
// Obligatorios en producción
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: cdn.sanity.io res.cloudinary.com; frame-src www.google.com; connect-src 'self' *.sanity.io *.supabase.co;"
"X-Frame-Options": "DENY"
"X-Content-Type-Options": "nosniff"
"Referrer-Policy": "strict-origin-when-cross-origin"
"Permissions-Policy": "camera=(), microphone=(), geolocation=()"
"Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload"
```

Regla: después de añadir cualquier dominio externo nuevo (fuente de fuentes, CDN, etc.) actualizar el CSP.

---

## Sanity Studio

- El Studio (`/studio`) requiere login con cuenta de Sanity. Sin autenticación, no se puede editar nada.
- En `robots.txt`: `Disallow: /studio` — el panel nunca aparece en buscadores.
- Los tokens de API de Sanity usados en el servidor tienen permisos **viewer** (solo lectura para el frontend). El editor usa la sesión de Sanity directamente.
- Nunca pasar el `SANITY_API_READ_TOKEN` a componentes cliente.

---

## Supabase y base de datos

- **Row Level Security (RLS) activado** en todas las tablas desde el primer día.
- Políticas RLS mínimas en `reservations`:
  - `INSERT`: cualquiera puede insertar (crear reserva), pero solo los campos permitidos.
  - `SELECT/UPDATE/DELETE`: solo `service_role` (acceso server-side).
- Los datos de clientes (nombre, email, teléfono) se almacenan **hasheados o cifrados** si no necesitan ser legibles.
- En la tabla `reservations`, el campo `client_email` se almacena en texto plano (necesario para enviar el email de confirmación), pero el teléfono se puede hashear con `pgcrypto`.
- Backups automáticos de Supabase activados (plan free incluye 1 backup diario con retención 7 días).

---

## Imágenes y uploads

- Las imágenes subidas por Amaya van a Sanity Assets (CDN de Sanity). No se aceptan uploads directos de usuarios finales.
- Si en el futuro se implementa upload de imágenes de clientes (ej. fotos antes/después enviadas por el cliente), validar:
  - Tamaño máximo: 5 MB.
  - Tipos permitidos: `image/jpeg`, `image/png`, `image/webp` (whitelist estricta).
  - Nunca servir el archivo directamente desde el servidor; redirigir a Cloudinary/Sanity.
  - Escanear con `sharp` para recodificar y eliminar metadatos EXIF (privacidad del cliente).

---

## Dependencias

- `pnpm audit` antes de cada deploy a producción. Si hay vulnerabilidades críticas o altas, no deployar.
- Revisar las dependencias con `pnpm outdated` mensualmente.
- No instalar paquetes con scripts `postinstall` desconocidos sin revisar el código del script.
- Lock file (`pnpm-lock.yaml`) siempre commiteado. Si se modifica sin `pnpm install`, investigar.

---

## RGPD / Privacidad

- El formulario de reservas incluye checkbox de aceptación de política de privacidad (campo requerido con zod).
- El campo `consentSigned` en el esquema `beforeAfter` de Sanity es la barrera legal para publicar fotos.
- Los datos de clientes no se comparten con terceros. Resend solo recibe email + nombre para el envío transaccional.
- Política de privacidad en `/privacidad` (página estática, mínimo LOPDGDD + RGPD).
- Cookies: solo las estrictamente necesarias si se usa Vercel Analytics. Documentar en `/cookies`.
