import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allPostsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { buildMetadata } from "@/lib/seo";
import type { SanityPost } from "@/types/sanity";

export const metadata = buildMetadata({
  title: "Blog de Estética",
  description:
    "Artículos sobre tratamientos estéticos, consejos de belleza y novedades del mundo de la estética en Murcia.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await sanityFetch<SanityPost[]>({
    query: allPostsQuery,
    tags: ["post"],
  });

  const postList = posts ?? [];

  return (
    <main className="flex-1 pt-24">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-16 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-vintage-lavender mb-3">
            Artículos y consejos
          </p>
          <h1 className="font-serif text-5xl text-deep-space">Blog</h1>
        </header>

        {postList.length === 0 ? (
          <p className="text-center text-muted-foreground py-16 text-lg">
            Próximamente, artículos sobre estética y belleza en Murcia.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {postList.map((post) => (
              <article key={post._id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-thistle/40 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-lavender-veil">
                    {post.coverImage && (
                      <Image
                        src={urlFor(post.coverImage).width(600).height(338).url()}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    {post.publishedAt && (
                      <time className="text-xs text-muted-foreground">
                        {format(new Date(post.publishedAt), "d 'de' MMMM yyyy", {
                          locale: es,
                        })}
                      </time>
                    )}
                    <h2 className="font-serif text-xl text-deep-space group-hover:text-vintage-lavender transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="text-sm font-medium text-vintage-lavender mt-2">
                      Leer más →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
