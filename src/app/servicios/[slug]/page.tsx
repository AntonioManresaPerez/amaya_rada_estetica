import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { serviceBySlugQuery, allServicesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { buildMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";
import type { SanityService } from "@/types/sanity";

export const revalidate = 3600;

export async function generateStaticParams() {
  const services = await sanityFetch<SanityService[]>({ query: allServicesQuery });
  return (services ?? []).map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await sanityFetch<SanityService>({
    query: serviceBySlugQuery,
    params: { slug },
  });
  if (!service) return {};
  return buildMetadata({
    title: `${service.title} en Murcia`,
    description: service.seo?.description ?? service.shortDescription,
    path: `/servicios/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await sanityFetch<SanityService>({
    query: serviceBySlugQuery,
    params: { slug },
    tags: ["service"],
  });

  if (!service) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    provider: { "@id": "https://amayarada.es#business" },
    areaServed: "Murcia",
    ...(service.price && {
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: service.price.toString(),
      },
    }),
    ...(service.faq?.length && {
      mainEntity: {
        "@type": "FAQPage",
        mainEntity: service.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    }),
  };

  return (
    <main className="flex-1 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Migas de pan"
        className="mx-auto max-w-7xl px-6 pt-6 text-sm text-muted-foreground"
      >
        <Link href="/servicios" className="hover:text-indigo-velvet transition-colors">
          Servicios
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{service.title}</span>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          {service.category && (
            <p className="text-sm tracking-[0.25em] uppercase text-vintage-lavender">
              {service.category.title}
            </p>
          )}
          <h1 className="font-serif text-4xl text-deep-space sm:text-5xl">
            {service.title}
          </h1>
          <p className="text-lg text-muted-foreground">{service.shortDescription}</p>
          <div className="flex gap-8 text-sm">
            {service.duration && (
              <div>
                <p className="text-muted-foreground">Duración</p>
                <p className="font-medium text-indigo-velvet">{service.duration} min</p>
              </div>
            )}
            {service.price && (
              <div>
                <p className="text-muted-foreground">Precio</p>
                <p className="font-medium text-vintage-lavender">Desde {service.price}€</p>
              </div>
            )}
          </div>
          <Link href="/reservar" className={buttonVariants({ size: "lg" })}>
            Reservar este tratamiento
          </Link>
        </div>

        {service.image && (
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={urlFor(service.image).width(800).height(600).url()}
              alt={service.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        )}
      </div>

      {service.faq && service.faq.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-24">
          <h2 className="font-serif text-3xl text-deep-space mb-10">
            Preguntas frecuentes
          </h2>
          <div className="space-y-6">
            {service.faq.map((faq, i) => (
              <div key={i} className="border-b border-thistle/30 pb-6">
                <h3 className="font-medium text-indigo-velvet mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
