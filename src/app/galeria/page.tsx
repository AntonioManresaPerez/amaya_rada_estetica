import { sanityFetch } from "@/sanity/lib/fetch";
import { beforeAfterQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { BeforeAfterGallery } from "@/components/gallery/BeforeAfterGallery";
import type { SanityBeforeAfter } from "@/types/sanity";

export const metadata = buildMetadata({
  title: "Galería Antes y Después",
  description:
    "Resultados reales de nuestros tratamientos estéticos en Murcia. Antes y después de dermapen, higiene facial, láser y tratamientos corporales.",
  path: "/galeria",
});

export default async function GaleriaPage() {
  const items = await sanityFetch<SanityBeforeAfter[]>({
    query: beforeAfterQuery,
    tags: ["beforeAfter"],
  });

  return (
    <main className="flex-1 pt-24">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-6 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-vintage-lavender mb-3">
            Resultados reales
          </p>
          <h1 className="font-serif text-5xl text-deep-space">Galería antes &amp; después</h1>
        </header>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Todas las imágenes están publicadas con el consentimiento expreso de nuestras
          clientas. Desliza para comparar el antes y el después.
        </p>
        <BeforeAfterGallery items={items ?? []} />
      </div>
    </main>
  );
}
