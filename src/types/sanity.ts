export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: { x: number; y: number; width: number; height: number };
  alt?: string;
}

export interface SanityFaq {
  question: string;
  answer: string;
}

export interface SanityServiceCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  order?: number;
}

export interface SanityService {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription?: unknown;
  duration?: number;
  price?: number;
  image?: SanityImage;
  gallery?: SanityImage[];
  contraindications?: string;
  faq?: SanityFaq[];
  category?: { title: string; slug: string };
  featured?: boolean;
  order?: number;
  seo?: SanityPageSeo;
}

export interface SanityAuthor {
  name: string;
  image?: SanityImage;
  bio?: unknown;
}

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImage;
  publishedAt?: string;
  body?: unknown;
  author?: SanityAuthor;
  seo?: SanityPageSeo;
}

export interface SanityBeforeAfter {
  _id: string;
  title: string;
  service?: { title: string; slug: string };
  beforeImage: SanityImage;
  afterImage: SanityImage;
  sessions?: number;
  notes?: string;
}

export interface SanityTestimonial {
  _id: string;
  quote: string;
  author: string;
  service?: string;
  rating?: number;
  image?: SanityImage;
}

export interface SanityPageSeo {
  title?: string;
  description?: string;
  ogImage?: SanityImage;
}

export interface SanitySiteSettings {
  name?: string;
  tagline?: string;
  description?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  geo?: { lat: number; lng: number };
  social?: Record<string, string>;
  hours?: Array<{ day: string; open: string; close: string }>;
  heroImage?: string;
  heroVideo?: string;
  showBonos?: boolean;
  bonosTitle?: string;
  bonosSubtitle?: string;
}

export type PromoPackKind = "bono" | "pack" | "tarjeta-regalo";

export interface SanityPromoPack {
  _id: string;
  title: string;
  kind?: PromoPackKind;
  description?: string;
  sessions?: number;
  price?: number;
  originalPrice?: number;
  badge?: string;
  featured?: boolean;
  order?: number;
}
