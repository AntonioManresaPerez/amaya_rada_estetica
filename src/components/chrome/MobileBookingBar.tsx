"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Barra CTA fija en móvil: deja "Reservar cita" siempre a mano en las páginas
// internas. Se oculta en la home (experiencia a pantalla completa) y en el
// propio flujo de reserva. Reserva hueco a la derecha para el botón de WhatsApp.
const HIDDEN_PREFIX = ["/reservar", "/studio"];

export function MobileBookingBar() {
  const pathname = usePathname();
  const hidden =
    pathname === "/" ||
    HIDDEN_PREFIX.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2 md:hidden">
      <Link
        href="/reservar"
        className="pointer-events-auto mr-20 flex min-h-12 items-center justify-center rounded-full bg-indigo-velvet px-6 text-sm font-semibold text-white shadow-lg shadow-deep-space/30 transition-colors hover:bg-indigo-velvet/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vintage-lavender focus-visible:ring-offset-2"
      >
        Reservar cita
      </Link>
    </div>
  );
}
