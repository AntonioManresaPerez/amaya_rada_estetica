"use client";

import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { urlFor } from "@/sanity/lib/image";
import type { SanityBeforeAfter } from "@/types/sanity";

interface Props {
  items: SanityBeforeAfter[];
}

export function BeforeAfterGallery({ items }: Props) {
  if (!items.length) {
    return (
      <p className="text-center text-muted-foreground py-16 text-lg">
        Próximamente publicaremos resultados de nuestros tratamientos.
      </p>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="rounded-2xl overflow-hidden border border-thistle/40 shadow-sm bg-card"
        >
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={urlFor(item.beforeImage).width(600).height(600).url()}
                alt={`Antes — ${item.title}`}
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={urlFor(item.afterImage).width(600).height(600).url()}
                alt={`Después — ${item.title}`}
              />
            }
            style={{ aspectRatio: "1 / 1" }}
          />
          <div className="p-4">
            <h3 className="font-medium text-indigo-velvet text-sm">{item.title}</h3>
            {item.service && (
              <p className="text-xs text-muted-foreground mt-0.5">{item.service.title}</p>
            )}
            {item.sessions && (
              <p className="text-xs text-muted-foreground">
                {item.sessions} {item.sessions === 1 ? "sesión" : "sesiones"}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
