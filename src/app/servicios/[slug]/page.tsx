import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { serviceBySlugQuery, allServicesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { buildMetadata } from "@/lib/seo";
import { pexels, servicePhotoId } from "@/lib/service-photos";
import { PortableText } from "@portabletext/react";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { SanityService } from "@/types/sanity";

type PortableTextValue = Parameters<typeof PortableText>[0]["value"];

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

  const allServices = await sanityFetch<SanityService[]>({
    query: allServicesQuery,
    tags: ["service"],
  });
  const related = (allServices ?? [])
    .filter(
      (s) =>
        s.slug !== service.slug &&
        service.category &&
        s.category?.slug === service.category.slug
    )
    .slice(0, 3);

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

        <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={
              service.image
                ? urlFor(service.image).width(800).height(600).url()
                : pexels(servicePhotoId(service.slug), 800, 600)
            }
            alt={service.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {service.longDescription != null && (
        <section className="mx-auto max-w-3xl px-6 pb-2">
          <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-deep-space prose-a:text-vintage-lavender prose-a:no-underline hover:prose-a:underline">
            <PortableText value={service.longDescription as PortableTextValue} />
          </div>
        </section>
      )}

      {service.benefits && service.benefits.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="mb-5 font-serif text-2xl text-deep-space">Beneficios</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {service.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-vintage-lavender" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </section>
      )}

      {service.process && service.process.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="mb-6 font-serif text-2xl text-deep-space">Cómo es la sesión</h2>
          <ol className="space-y-5">
            {service.process.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-velvet text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  {step.title && <p className="font-medium text-deep-space">{step.title}</p>}
                  {step.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {service.gallery && service.gallery.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-8">
          <h2 className="mb-6 font-serif text-2xl text-deep-space">Galería</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.gallery.map((img, i) => (
              <div
                key={i}
                className="relative aspect-4/3 overflow-hidden rounded-xl bg-lavender-veil"
              >
                <Image
                  src={urlFor(img).width(600).height(450).url()}
                  alt={`${service.title} — imagen ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

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

      {service.contraindications && service.contraindications.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <h2 className="mb-4 font-serif text-2xl text-deep-space">Contraindicaciones</h2>
          <ul className="space-y-2">
            {service.contraindications.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-thistle" />
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-lavender-veil/30 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center font-serif text-2xl text-deep-space md:text-3xl">
              Otros tratamientos
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <Link
                  key={s._id}
                  href={`/servicios/${s.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-thistle/40 bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-lavender-veil">
                    <Image
                      src={
                        s.image
                          ? urlFor(s.image).width(600).height(450).url()
                          : pexels(servicePhotoId(s.slug))
                      }
                      alt={s.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="font-serif text-lg text-deep-space transition-colors group-hover:text-vintage-lavender">
                      {s.title}
                    </h3>
                    <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                      {s.shortDescription}
                    </p>
                    {s.price && (
                      <span className="text-sm font-medium text-vintage-lavender">
                        Desde {s.price}€
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
