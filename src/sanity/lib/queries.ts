import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    name,
    tagline,
    description,
    address,
    phone,
    whatsapp,
    email,
    geo,
    social,
    hours,
    "heroImage": heroImage.asset->url,
    "heroVideo": heroVideo.asset->url
  }
`;

export const serviceCategoriesQuery = groq`
  *[_type == "serviceCategory"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    description,
    order
  }
`;

export const allServicesQuery = groq`
  *[_type == "service"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    duration,
    price,
    image,
    "category": category->{title, "slug": slug.current},
    featured,
    order
  }
`;

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    longDescription,
    duration,
    price,
    image,
    gallery,
    contraindications,
    faq,
    "category": category->{title, "slug": slug.current},
    seo
  }
`;

export const featuredServicesQuery = groq`
  *[_type == "service" && featured == true] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    image,
    price
  }
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt,
    "author": author->{name, image}
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt,
    body,
    "author": author->{name, image, bio},
    seo
  }
`;

export const beforeAfterQuery = groq`
  *[_type == "beforeAfter" && consentSigned == true] | order(order asc){
    _id,
    title,
    "service": service->{title, "slug": slug.current},
    beforeImage,
    afterImage,
    sessions,
    notes
  }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(order asc){
    _id,
    quote,
    author,
    service,
    rating,
    image
  }
`;
