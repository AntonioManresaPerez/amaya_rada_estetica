import { sanityFetch } from "@/sanity/lib/fetch";
import {
  testimonialsQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesFullscreenSection } from "@/components/sections/ServicesFullscreenSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import type { SanityTestimonial, SanitySiteSettings } from "@/types/sanity";

export default async function HomePage() {
  const [settings, testimonials] = await Promise.all([
    sanityFetch<SanitySiteSettings>({ query: siteSettingsQuery, tags: ["siteSettings"] }),
    sanityFetch<SanityTestimonial[]>({ query: testimonialsQuery, tags: ["testimonial"] }),
  ]);

  return (
    <main className="flex-1">
      <HeroSection
        heroVideo={settings?.heroVideo}
        tagline={settings?.tagline}
      />
      <ServicesFullscreenSection />
      <AboutSection />
      <TestimonialsSection testimonials={testimonials ?? []} />
      <CtaSection />
      <FaqSection />
    </main>
  );
}
