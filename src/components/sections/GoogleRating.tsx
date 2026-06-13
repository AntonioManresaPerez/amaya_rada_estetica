import { Star } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

// Insignia de valoración de Google. No renderiza nada si no hay reseñas
// configuradas en site-config (reviews.count === 0).
export function GoogleRating({ className = "" }: { className?: string }) {
  const { rating, count, url } = siteConfig.reviews;
  if (!count) return null;

  const full = Math.round(rating);
  const ratingEs = rating.toLocaleString("es-ES");
  const label = `${ratingEs} sobre 5 según ${count} reseñas en Google`;

  const content = (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < full ? "fill-amber-400 text-amber-400" : "fill-thistle/40 text-thistle/40"}`}
          />
        ))}
      </span>
      <span>
        <strong className="font-semibold">{ratingEs}</strong> · {count} reseñas en Google
      </span>
    </span>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (abre Google en una pestaña nueva)`}
        className={`transition-opacity hover:opacity-80 ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <span aria-label={label} className={className}>
      {content}
    </span>
  );
}
