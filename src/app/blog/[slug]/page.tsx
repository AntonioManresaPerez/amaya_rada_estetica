import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postBySlugQuery, allPostsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import type { SanityPost } from "@/types/sanity";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await sanityFetch<SanityPost[]>({ query: allPostsQuery });
  return (posts ?? []).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await sanityFetch<SanityPost>({ query: postBySlugQuery, params: { slug } });
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.seo?.description ?? post.excerpt,
    path: `/blog/${post.slug}`,
    ogImage: post.coverImage
      ? urlFor(post.coverImage).width(1200).height(630).url()
      : undefined,
  });
}

type PortableTextValue = Parameters<typeof PortableText>[0]["value"];

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await sanityFetch<SanityPost>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post"],
  });

  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author?.name ?? siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(post.coverImage && {
      image: urlFor(post.coverImage).width(1200).height(630).url(),
    }),
  };

  return (
    <main className="flex-1 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <nav
        aria-label="Migas de pan"
        className="mx-auto max-w-3xl px-6 pt-6 text-sm text-muted-foreground"
      >
        <Link href="/blog" className="hover:text-indigo-velvet transition-colors">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{post.title}</span>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10 space-y-4">
          {post.publishedAt && (
            <time className="text-sm text-muted-foreground">
              {format(new Date(post.publishedAt), "d 'de' MMMM yyyy", { locale: es })}
            </time>
          )}
          <h1 className="font-serif text-4xl text-deep-space sm:text-5xl">{post.title}</h1>
          {post.author && (
            <p className="text-sm text-muted-foreground">Por {post.author.name}</p>
          )}
        </header>

        {post.coverImage && (
          <div className="relative aspect-[16/9] mb-10 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={urlFor(post.coverImage).width(1200).height(675).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {post.body != null && (
          <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-deep-space prose-a:text-vintage-lavender prose-a:no-underline hover:prose-a:underline">
            <PortableText value={post.body as PortableTextValue} />
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-thistle/30">
          <Link
            href="/blog"
            className="text-vintage-lavender hover:text-indigo-velvet transition-colors text-sm"
          >
            ← Volver al blog
          </Link>
        </div>
      </article>
    </main>
  );
}
