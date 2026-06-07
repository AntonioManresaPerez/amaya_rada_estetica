import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allServicesQuery, serviceCategoriesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { buildMetadata } from "@/lib/seo";
import type { SanityService, SanityServiceCategory } from "@/types/sanity";

const CDN = "https://images.pexels.com/photos";
const pexels = (id: number) =>
  `${CDN}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=450&fit=crop`;

const SERVICE_PHOTOS: Record<string, number> = {
  dermapen: 30809949,
  "higiene-facial": 3985329,
  laser: 4586726,
  pedicura: 34930123,
  maderoterapia: 6628691,
  presoterapia: 5888064,
  manchas: 5701545,
  vacum: 8312823,
};

export const metadata = buildMetadata({
  title: "Servicios de Estética en Murcia",
  description:
    "Todos nuestros tratamientos estéticos: higiene facial, dermapen, láser, masajes y pedicura en Murcia. Consulta precios y reserva online.",
  path: "/servicios",
});

function ServiceCard({ service }: { service: SanityService }) {
  const fallbackId = SERVICE_PHOTOS[service.slug];
  const imgSrc = service.image
    ? urlFor(service.image).width(600).height(450).url()
    : fallbackId ? pexels(fallbackId) : null;

  return (
    <Link
      href={`/servicios/${service.slug}`}
      className="group flex flex-col rounded-2xl border border-thistle/40 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-4/3 bg-lavender-veil overflow-hidden">
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 gap-2">
        <h3 className="font-serif text-lg text-deep-space group-hover:text-vintage-lavender transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {service.shortDescription}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-thistle/20">
          {service.duration && (
            <span className="text-xs text-muted-foreground">{service.duration} min</span>
          )}
          {service.price && (
            <span className="text-sm font-medium text-vintage-lavender">
              Desde {service.price}€
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function ServiciosPage() {
  const [services, categories] = await Promise.all([
    sanityFetch<SanityService[]>({ query: allServicesQuery, tags: ["service"] }),
    sanityFetch<SanityServiceCategory[]>({
      query: serviceCategoriesQuery,
      tags: ["serviceCategory"],
    }),
  ]);

  const serviceList = services ?? [];
  const categoryList = categories ?? [];

  return (
    <main className="flex-1 pt-24">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <header className="mb-10 md:mb-16 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-vintage-lavender mb-3">
            Lo que ofrecemos
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-deep-space">Nuestros servicios</h1>
        </header>

        {categoryList.length > 0 ? (
          categoryList.map((cat) => {
            const catServices = serviceList.filter(
              (s) => s.category?.slug === cat.slug
            );
            if (!catServices.length) return null;
            return (
              <section key={cat._id} className="mb-16">
                <h2 className="mb-8 font-serif text-2xl text-indigo-velvet border-b border-thistle pb-3">
                  {cat.title}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {catServices.map((s) => (
                    <ServiceCard key={s._id} service={s} />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceList.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        )}

        {serviceList.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            Próximamente publicaremos nuestro catálogo de servicios.
          </p>
        )}
      </div>
    </main>
  );
}
