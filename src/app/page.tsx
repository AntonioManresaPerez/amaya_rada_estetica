import { sanityFetch } from "@/sanity/lib/fetch";
import {
  featuredServicesQuery,
  testimonialsQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedServicesSection } from "@/components/sections/FeaturedServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import type { SanityService, SanityTestimonial, SanitySiteSettings } from "@/types/sanity";

export default async function HomePage() {
  const [settings, services, testimonials] = await Promise.all([
    sanityFetch<SanitySiteSettings>({ query: siteSettingsQuery, tags: ["siteSettings"] }),
    sanityFetch<SanityService[]>({ query: featuredServicesQuery, tags: ["service"] }),
    sanityFetch<SanityTestimonial[]>({ query: testimonialsQuery, tags: ["testimonial"] }),
  ]);

  return (
    <main className="flex-1">
      <HeroSection
        heroVideo={settings?.heroVideo}
        tagline={settings?.tagline}
      />
      <FeaturedServicesSection services={services ?? []} />
      <AboutSection />
      <TestimonialsSection testimonials={testimonials ?? []} />
      <CtaSection />
    </main>
  );
}
