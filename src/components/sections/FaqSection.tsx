import { ChevronDown } from "lucide-react";
import { DEFAULT_FAQS } from "@/lib/faqs";

// Sección de preguntas frecuentes (tema oscuro, empalma con el CTA y el footer).
// Acordeón nativo (<details>) → accesible y sin JS. Emite FAQPage JSON-LD.
export function FaqSection() {
  const faqs = DEFAULT_FAQS;
  if (!faqs.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="bg-deep-space px-6 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-vintage-lavender">
            Dudas frecuentes
          </p>
          <h2 className="font-serif text-3xl text-white md:text-4xl">Preguntas frecuentes</h2>
        </header>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f, i) => (
            <details key={i} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium text-white [&::-webkit-details-marker]:hidden">
                {f.question}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-vintage-lavender transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-lavender-veil/75">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
