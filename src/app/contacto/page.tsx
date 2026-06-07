import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Contacto y Horarios",
  description: `Contacta con Amaya Rada Estética en Murcia. Tel: ${siteConfig.contact.phoneDisplay}. Horarios, dirección y reserva online de cita.`,
  path: "/contacto",
});

const DAY_MAP: Record<string, string> = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

export default function ContactoPage() {
  const whatsappText = encodeURIComponent("Hola Amaya, me gustaría hacer una consulta.");
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappText}`;

  return (
    <main className="flex-1 pt-24">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-16 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-vintage-lavender mb-3">
            Estamos aquí para ti
          </p>
          <h1 className="font-serif text-5xl text-deep-space">Contacto</h1>
        </header>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Info */}
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl text-indigo-velvet mb-5">
                Información de contacto
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-4">
                  <span className="w-20 font-medium text-vintage-lavender">Teléfono</span>
                  <Link
                    href={`tel:${siteConfig.contact.phone}`}
                    className="hover:text-vintage-lavender transition-colors"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </Link>
                </li>
                <li className="flex gap-4">
                  <span className="w-20 font-medium text-vintage-lavender">WhatsApp</span>
                  <Link
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-vintage-lavender transition-colors"
                  >
                    Enviar mensaje
                  </Link>
                </li>
                <li className="flex gap-4">
                  <span className="w-20 font-medium text-vintage-lavender">Email</span>
                  <Link
                    href={`mailto:${siteConfig.contact.email}`}
                    className="hover:text-vintage-lavender transition-colors"
                  >
                    {siteConfig.contact.email}
                  </Link>
                </li>
                <li className="flex gap-4">
                  <span className="w-20 font-medium text-vintage-lavender">Ciudad</span>
                  <span>
                    {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-indigo-velvet mb-5">Horarios</h2>
              <ul className="space-y-2">
                {Array.from(
                  siteConfig.hours.reduce((map, h) => {
                    const slots = map.get(h.day) ?? [];
                    map.set(h.day, [...slots, `${h.open} – ${h.close}`]);
                    return map;
                  }, new Map<string, string[]>())
                ).map(([day, slots]) => (
                  <li
                    key={day}
                    className="flex justify-between text-sm border-b border-thistle/20 pb-2"
                  >
                    <span className="font-medium">{DAY_MAP[day] ?? day}</span>
                    <span className="text-muted-foreground">
                      {slots.join(" / ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/reservar" className={buttonVariants({ size: "lg" })}>
                Reservar cita online
              </Link>
              <Link
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Instagram
              </Link>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-thistle/40 aspect-square lg:aspect-auto lg:h-[500px]">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${siteConfig.address.streetAddress}, ${siteConfig.address.postalCode} ${siteConfig.address.addressLocality}, ${siteConfig.address.addressRegion}`)}&z=17&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localización de Amaya Rada Estética en Murcia"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
