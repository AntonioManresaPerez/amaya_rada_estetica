import Image from "next/image";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { siteConfig } from "@/lib/site-config";
import { DEFAULT_INSTAGRAM_POSTS, instagramHandle } from "@/lib/instagram";

// Glifo de Instagram inline (currentColor): lucide ya no exporta iconos de marca.
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Sección "Síguenos en Instagram" (tema oscuro, empalma con la FAQ y el footer).
// Mosaico de fotos que enlazan al perfil. Las imágenes son placeholders editables
// en src/lib/instagram.ts → sustitúyelas por fotos reales cuando las tengas.
export function InstagramSection() {
  const posts = DEFAULT_INSTAGRAM_POSTS;
  const profileUrl = siteConfig.social.instagram;
  if (!posts.length || !profileUrl) return null;

  return (
    <section className="border-t border-white/10 bg-deep-space px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-vintage-lavender">
            @{instagramHandle}
          </p>
          <h2 className="font-serif text-3xl text-white md:text-4xl">
            Síguenos en Instagram
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-lavender-veil/70">
            Resultados, novedades y consejos de cuidado en nuestro día a día.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          {posts.map((post, i) => (
            <li key={i}>
              <TrackedLink
                href={profileUrl}
                external
                event="instagram_click"
                data={{ from: "home_grid", index: i }}
                aria-label={`Ver nuestro perfil de Instagram — ${post.alt}`}
                className="group relative block aspect-square overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vintage-lavender"
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-deep-space/0 text-white opacity-0 transition-all duration-300 group-hover:bg-deep-space/45 group-hover:opacity-100">
                  <InstagramGlyph className="h-7 w-7" />
                </span>
              </TrackedLink>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <TrackedLink
            href={profileUrl}
            external
            event="instagram_click"
            data={{ from: "home_button" }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vintage-lavender"
          >
            <InstagramGlyph className="h-4 w-4" />
            Síguenos @{instagramHandle}
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
