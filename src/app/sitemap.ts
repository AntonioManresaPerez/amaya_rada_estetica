import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { sanityFetch } from "@/sanity/lib/fetch";
import { groq } from "next-sanity";

const base = siteConfig.url;

const staticRoutes: MetadataRoute.Sitemap = [
  { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  { url: `${base}/servicios`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  { url: `${base}/galeria`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${base}/contacto`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  { url: `${base}/reservar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceSlugs, postSlugs] = await Promise.all([
    sanityFetch<{ slug: string }[]>({
      query: groq`*[_type == "service" && defined(slug.current)]{"slug": slug.current}`,
      tags: ["service"],
    }),
    sanityFetch<{ slug: string; publishedAt: string }[]>({
      query: groq`*[_type == "post" && defined(slug.current)]{"slug": slug.current, publishedAt}`,
      tags: ["post"],
    }),
  ]);

  const serviceRoutes: MetadataRoute.Sitemap = (serviceSlugs ?? []).map((s) => ({
    url: `${base}/servicios/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = (postSlugs ?? []).map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
