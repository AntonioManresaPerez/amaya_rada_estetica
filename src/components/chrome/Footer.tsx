import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const DAY_MAP: Record<string, string> = {
  Monday: "Lun",
  Tuesday: "Mar",
  Wednesday: "Mié",
  Thursday: "Jue",
  Friday: "Vie",
  Saturday: "Sáb",
  Sunday: "Dom",
};

const navLinks = [
  { href: "/servicios", label: "Servicios" },
  { href: "/galeria", label: "Galería" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
  { href: "/reservar", label: "Reservar cita" },
];

const legalLinks = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep-space text-lavender-veil/80">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {/* Brand */}
        <div className="space-y-4">
          <p className="font-serif text-xl font-semibold text-white">{siteConfig.shortName}</p>
          <p className="text-sm leading-relaxed max-w-xs">
            Centro de estética avanzada en Murcia especializado en tratamientos faciales, corporales y láser.
          </p>
          <div className="flex gap-4 text-sm">
            <Link
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </Link>
            <Link
              href={siteConfig.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              TikTok
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <p className="text-xs tracking-[0.2em] uppercase text-lavender-veil/50 mb-4">Navegación</p>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + Hours */}
        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-lavender-veil/50 mb-3">Contacto</p>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href={`tel:${siteConfig.contact.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contact.phoneDisplay}
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contact.email}
                </Link>
              </li>
              <li>{siteConfig.address.addressLocality}, España</li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-lavender-veil/50 mb-3">Horarios</p>
            <ul className="space-y-1 text-xs">
              {Array.from(
                siteConfig.hours.reduce((map, h) => {
                  const slots = map.get(h.day) ?? [];
                  map.set(h.day, [...slots, `${h.open} – ${h.close}`]);
                  return map;
                }, new Map<string, string[]>())
              ).map(([day, slots]) => (
                <li key={day} className="flex gap-3">
                  <span className="w-8 text-lavender-veil/60">{DAY_MAP[day] ?? day}</span>
                  <span>{slots.join(" / ")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-lavender-veil/10 mx-auto max-w-7xl px-6 py-4 flex flex-wrap justify-between gap-2 text-xs text-lavender-veil/50">
        <p>
          © {year} {siteConfig.name}. Todos los derechos reservados.
        </p>
        <div className="flex gap-4">
          {legalLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-lavender-veil transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
