import { siteConfig } from "@/lib/site-config";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import type { SanityPromoPack } from "@/types/sanity";

const KIND_LABEL: Record<string, string> = {
  bono: "Bono",
  pack: "Pack",
  "tarjeta-regalo": "Tarjeta regalo",
};

interface Props {
  packs: SanityPromoPack[];
  title?: string;
  subtitle?: string;
}

export function BonosSection({ packs, title, subtitle }: Props) {
  if (!packs.length) return null;

  return (
    <section className="relative bg-linear-to-b from-lavender-veil/40 to-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center md:mb-12">
          <p className="mb-3 text-sm tracking-[0.3em] uppercase text-vintage-lavender">
            Ahorra y regala
          </p>
          <h2 className="font-serif text-3xl text-deep-space md:text-4xl">
            {title || "Bonos y tarjetas regalo"}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
          ) : null}
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((p) => {
            const kindLabel = KIND_LABEL[p.kind ?? "bono"] ?? "Bono";
            const msg =
              p.kind === "tarjeta-regalo"
                ? `Hola Amaya, me interesa la tarjeta regalo. ¿Me das más información?`
                : `Hola Amaya, me interesa ${kindLabel.toLowerCase()} "${p.title}". ¿Me das más información?`;
            const href = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(msg)}`;

            return (
              <div
                key={p._id}
                className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md ${
                  p.featured
                    ? "border-vintage-lavender ring-1 ring-vintage-lavender/40"
                    : "border-thistle/40"
                }`}
              >
                {p.badge ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-vintage-lavender px-3 py-1 text-xs font-medium text-white shadow-sm">
                    {p.badge}
                  </span>
                ) : null}

                <span className="text-xs uppercase tracking-[0.2em] text-vintage-lavender/80">
                  {kindLabel}
                </span>
                <h3 className="mt-2 font-serif text-xl text-deep-space">{p.title}</h3>
                {p.description ? (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}

                <div className="mt-4 flex items-end gap-2">
                  {typeof p.price === "number" ? (
                    <>
                      <span className="font-serif text-2xl text-indigo-velvet">{p.price}€</span>
                      {typeof p.originalPrice === "number" && p.originalPrice > p.price ? (
                        <span className="text-sm text-muted-foreground line-through">
                          {p.originalPrice}€
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className="font-serif text-xl text-indigo-velvet">Importe a elegir</span>
                  )}
                  {p.sessions ? (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {p.sessions} sesiones
                    </span>
                  ) : null}
                </div>

                <TrackedLink
                  href={href}
                  external
                  event="bono_whatsapp_click"
                  data={{ pack: p.title }}
                  aria-label={`Consultar ${p.title} por WhatsApp`}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-velvet px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-velvet/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vintage-lavender focus-visible:ring-offset-2"
                >
                  Consultar por WhatsApp
                </TrackedLink>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
