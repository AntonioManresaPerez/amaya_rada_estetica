# Reglas de Negocio — Amaya Rada Estética

## Horarios del centro

| Día | Mañana | Tarde |
|-----|--------|-------|
| Lunes – Viernes | 10:00 – 14:00 | 16:00 – 20:00 |
| Sábado | 10:00 – 14:00 | Cerrado |
| Domingo | Cerrado | Cerrado |

- El último slot de mañana es **14:00**; el de tarde es **20:00**.
- Pausa de comida: 14:00 – 16:00 (no hay citas en ese rango).

## Buffer entre clientes

- **10 minutos** de cortesía entre cliente y cliente para limpieza.
- El buffer se aplica **solo a las reservas ya existentes** (su ventana se amplía en +10 min).
- El buffer **no se aplica al nuevo servicio** para evitar bloquear slots previos que terminan justo en la reserva siguiente.
- El buffer **no penaliza el cierre**: si un servicio termina a las 14:05 o 20:10 está bien, no hay que bloquearlo.

## Filosofía de captación — regla de oro

> **Nunca ahuyentar al cliente. Siempre intentar captar la reserva, ya sea ese día u otro.**

- Si un slot es dudoso (el servicio se pasaría del horario de cierre) **no bloquear ni mostrar error**.
- En su lugar, **redirigir a WhatsApp** con un mensaje predeterminado amigable para que Amaya confirme disponibilidad manualmente.
- El cliente que escribe por WhatsApp es un cliente potencial, no uno perdido.

## WhatsApp corporativo

- Número: **+34 604 807 886** (`wa.me/34604807886`)
- Mensaje predeterminado cuando el servicio se pasa del cierre:

```
Hola! Me gustaría reservar "[SERVICIO]" a las [HORA] del [FECHA].
El tratamiento dura [X] min y terminaría a las [FIN], sé que cerráis a las [CIERRE].
¿Podéis confirmar si hay disponibilidad? Gracias 😊
```

## Slots de reserva online

- Slots cada **30 minutos**: 10:00, 10:30, 11:00, 11:30 … 13:00, 13:30 / 16:00, 16:30 … 19:00, 19:30.
- El último slot de mañana es **13:30** (no 14:00); el de tarde es **19:30** (no 20:00).
  El servicio puede terminar a las 14:xx o 20:xx — eso está bien; pero no tiene sentido *empezar* a la hora de cierre.
- Un slot queda **bloqueado** si cae dentro de la ventana de una reserva existente (inicio + duración + 10 min buffer).
- Un slot queda **bloqueado** si el nuevo servicio terminaría solapándose con el inicio de una reserva existente.
- Un slot **no se bloquea** por overflow de cierre; en ese caso → WhatsApp redirect.

## Paleta de colores oficial

`lavender-veil` · `thistle` · `vintage-lavender` · `indigo-velvet` · `deep-space`

**Nunca usar la paleta beige del proyecto v1.**

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| CMS | Sanity (project `2ilaiz3c`, dataset `production`) |
| Base de datos | Supabase (reservas, disponibilidad) |
| Email | Resend (confirmación + recordatorio 24 h antes) |
| Hosting | Vercel |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Animaciones | Framer Motion |

## Servicios (datos en Sanity)

- 14 servicios en 3 categorías: Faciales, Capilares, Corporales.
- La **Valoración** es gratuita (sin campo `price`).
- Los servicios con `featured: true` aparecen en la sección destacada de la home.
- Las imágenes se gestionan desde Sanity Studio (`/studio`) → pestaña Multimedia de cada servicio.
