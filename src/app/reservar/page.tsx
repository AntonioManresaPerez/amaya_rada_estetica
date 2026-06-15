import { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allServicesQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { BookingForm } from "@/components/booking/BookingForm";
import type { SanityService } from "@/types/sanity";

export const metadata: Metadata = buildMetadata({
  title: "Reservar cita",
  description:
    "Reserva tu cita online en Amaya Rada Estética. Elige servicio, fecha y hora en menos de 2 minutos.",
  path: "/reservar",
});

type Props = { searchParams: Promise<{ servicio?: string }> };

export default async function ReservarPage({ searchParams }: Props) {
  const { servicio } = await searchParams;
  const services =
    (await sanityFetch<SanityService[]>({
      query: allServicesQuery,
      tags: ["service"],
    })) ?? [];

  return (
    <main className="flex-1 pt-24">
      <div className="mx-auto max-w-3xl px-6 pt-10 pb-4">
        <h1 className="font-serif text-4xl text-deep-space sm:text-5xl">
          Reserva tu cita
        </h1>
        <p className="mt-3 text-muted-foreground">
          Sigue los pasos para elegir tu tratamiento, fecha y datos de contacto.
        </p>
      </div>

      <BookingForm services={services} initialServiceSlug={servicio} />
    </main>
  );
}
