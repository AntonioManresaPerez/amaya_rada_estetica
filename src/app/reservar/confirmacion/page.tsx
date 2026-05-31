import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CalendarDays, Clock, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reserva confirmada — Amaya Rada Estética",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{
    nombre?: string;
    servicio?: string;
    fecha?: string;
    hora?: string;
  }>;
};

export default async function ConfirmacionPage({ searchParams }: Props) {
  const { nombre, servicio, fecha, hora } = await searchParams;

  const whatsapp = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    `Hola Amaya, acabo de reservar una cita para ${servicio ?? "un tratamiento"} el ${fecha ?? ""} a las ${hora ?? ""}.`
  )}`;

  return (
    <main className="flex-1 pt-24">
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        {/* Icono */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lavender-veil">
          <CheckCircle2 className="h-10 w-10 text-vintage-lavender" />
        </div>

        <h1 className="font-serif text-3xl text-deep-space sm:text-4xl mb-3">
          ¡Reserva confirmada!
        </h1>
        <p className="text-muted-foreground mb-8">
          {nombre
            ? `Gracias, ${nombre}. Pronto recibirás un email con los detalles.`
            : "Recibirás un email con los detalles de tu cita."}
        </p>

        {/* Resumen */}
        {(servicio || fecha || hora) && (
          <div className="mb-10 rounded-2xl border border-thistle/40 bg-card p-6 text-left space-y-3">
            {servicio && (
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender-veil">
                  <CalendarDays className="h-4 w-4 text-vintage-lavender" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Servicio</p>
                  <p className="font-medium text-deep-space">{servicio}</p>
                </div>
              </div>
            )}
            {fecha && (
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender-veil">
                  <CalendarDays className="h-4 w-4 text-vintage-lavender" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="font-medium text-deep-space capitalize">{fecha}</p>
                </div>
              </div>
            )}
            {hora && (
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender-veil">
                  <Clock className="h-4 w-4 text-vintage-lavender" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Hora</p>
                  <p className="font-medium text-deep-space">{hora}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Volver al inicio
          </Link>
          <Link
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants(),
              "gap-2"
            )}
          >
            <MessageCircle className="h-4 w-4" />
            Contactar por WhatsApp
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Si no recibes el email en los próximos minutos, revisa tu carpeta de
          spam o{" "}
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="text-vintage-lavender hover:underline"
          >
            llámanos
          </a>
          .
        </p>
      </div>
    </main>
  );
}
