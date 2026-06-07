/**
 * Seed inicial de Sanity: categorías + servicios de Amaya Rada Estética.
 *
 * Uso:
 *   1. Crea un token de escritura en https://www.sanity.io/manage →
 *      tu proyecto → API → Tokens → "Add API token" (rol "Editor").
 *   2. Copia .env.local.example a .env.local y rellena los valores.
 *   3. pnpm seed
 */

// Ejecutar con: node --env-file=.env.local scripts/seed-sanity.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "❌  Faltan variables de entorno.\n" +
      "    Necesitas NEXT_PUBLIC_SANITY_PROJECT_ID y SANITY_API_WRITE_TOKEN en .env.local"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

// ── Categorías ──────────────────────────────────────────────────────────────

const categories = [
  { _id: "cat-facial", title: "Tratamientos Faciales", slug: "faciales", order: 1 },
  { _id: "cat-capilar", title: "Tratamientos Capilares", slug: "capilares", order: 2 },
  { _id: "cat-corporal", title: "Tratamientos Corporales", slug: "corporales", order: 3 },
];

// ── Servicios ────────────────────────────────────────────────────────────────
// featured: true → aparece en la home. Máximo 4-6 destacados.

const services = [
  {
    _id: "service-valoracion",
    title: "Valoración",
    slug: "valoracion",
    shortDescription:
      "Primera visita gratuita para analizar tu piel y definir el tratamiento más adecuado a tus necesidades.",
    duration: 30,
    price: null, // gratuita
    featured: false,
    order: 1,
    categoryId: "cat-facial",
  },
  {
    _id: "service-higiene-facial",
    title: "Higiene Facial Profunda",
    slug: "higiene-facial-profunda",
    shortDescription:
      "Limpieza completa en profundidad: extracción de impurezas, hidratación y revitalización adaptadas a tu tipo de piel.",
    duration: 120,
    price: 50,
    featured: true,
    order: 2,
    categoryId: "cat-facial",
  },
  {
    _id: "service-hidrafacial",
    title: "Hidrafacial",
    slug: "hidrafacial",
    shortDescription:
      "Tratamiento multistep que limpia, exfolia, extrae impurezas e hidrata la piel con sueros nutritivos en una sola sesión.",
    duration: 120,
    price: 60,
    featured: true,
    order: 3,
    categoryId: "cat-facial",
  },
  {
    _id: "service-dermapen-facial",
    title: "Tratamiento Dermapen Facial",
    slug: "dermapen-facial",
    shortDescription:
      "Microagujas con activos premium (exosomas, ácido hialurónico, péptidos, vitaminas, despigmentantes) para regenerar, iluminar y corregir cicatrices.",
    duration: 90,
    price: 100,
    featured: true,
    order: 4,
    categoryId: "cat-facial",
  },
  {
    _id: "service-hidralips-hidratacion",
    title: "Hidralips Dermapen Hidratación",
    slug: "hidralips-dermapen-hidratacion",
    shortDescription:
      "Dermapen en labios con ácido hialurónico para una hidratación profunda y aumento natural del volumen.",
    duration: 45,
    price: 70,
    featured: false,
    order: 5,
    categoryId: "cat-facial",
  },
  {
    _id: "service-hidralips-color",
    title: "Hidralips Color Dermapen",
    slug: "hidralips-color-dermapen",
    shortDescription:
      "Dermapen en labios con ácido hialurónico más color: hidratación, volumen y tono natural en una sola sesión.",
    duration: 50,
    price: 90,
    featured: false,
    order: 6,
    categoryId: "cat-facial",
  },
  {
    _id: "service-capilar-dermapen",
    title: "Tratamiento Capilar Dermapen + Alta Frecuencia",
    slug: "capilar-dermapen-alta-frecuencia",
    shortDescription:
      "Combinación de microagujas y alta frecuencia para estimular el cuero cabelludo, frenar la caída y favorecer el crecimiento del cabello.",
    duration: 60,
    price: 100,
    featured: false,
    order: 7,
    categoryId: "cat-capilar",
  },
  {
    _id: "service-ojeras-dermapen",
    title: "Tratamiento Ojeras Dermapen",
    slug: "ojeras-dermapen",
    shortDescription:
      "Dermapen periocular con activos despigmentantes e hidratantes para atenuar ojeras y devolver luminosidad a la mirada.",
    duration: 50,
    price: 60,
    featured: false,
    order: 8,
    categoryId: "cat-facial",
  },
  {
    _id: "service-radiofrecuencia",
    title: "Radiofrecuencia Facial",
    slug: "radiofrecuencia-facial",
    shortDescription:
      "Tecnología que estimula el colágeno en profundidad para tensar, reafirmar y rejuvenecer el óvalo facial sin agujas.",
    duration: 90,
    price: 50,
    featured: true,
    order: 9,
    categoryId: "cat-facial",
  },
  {
    _id: "service-kobido",
    title: "Masaje Facial Kobido — Efecto Lifting",
    slug: "masaje-facial-kobido",
    shortDescription:
      "Técnica japonesa de masaje facial que tonifica, drena y redefine el contorno del rostro con efecto lifting inmediato.",
    duration: 60,
    price: 40,
    featured: true,
    order: 10,
    categoryId: "cat-facial",
  },
  {
    _id: "service-maderoterapia",
    title: "Maderoterapia Facial — Lifting + Drenaje",
    slug: "maderoterapia-facial",
    shortDescription:
      "Masaje facial con instrumentos de madera que modela, drena y reafirma el rostro de forma natural.",
    duration: 60,
    price: 45,
    featured: false,
    order: 11,
    categoryId: "cat-facial",
  },
  {
    _id: "service-peeling",
    title: "Tratamiento Peeling Facial",
    slug: "peeling-facial",
    shortDescription:
      "Peelings adaptados a cada objetivo: acné, despigmentación, hidratación, efecto glow, marcas, cicatrices y antienvejecimiento.",
    duration: 75,
    price: 80,
    featured: false,
    order: 12,
    categoryId: "cat-facial",
  },
  {
    _id: "service-espiculas",
    title: "Tratamiento Facial Espículas",
    slug: "facial-espiculas",
    shortDescription:
      "Tratamiento con bioestimuladores naturales (espículas de esponja marina) que regenera la piel desde el interior para una luminosidad extraordinaria.",
    duration: 75,
    price: 90,
    featured: false,
    order: 13,
    categoryId: "cat-facial",
  },
  {
    _id: "service-despigmentante-manos",
    title: "Tratamiento Despigmentante Manos y Axilas",
    slug: "despigmentante-manos-axilas",
    shortDescription:
      "Tratamiento específico para aclarar y unificar el tono en zonas hiperpigmentadas como manos y axilas.",
    duration: 50,
    price: 80,
    featured: false,
    order: 14,
    categoryId: "cat-corporal",
  },
];

// ── Seed ────────────────────────────────────────────────────────────────────

async function seed() {
  const tx = client.transaction();

  for (const cat of categories) {
    tx.createOrReplace({
      _id: cat._id,
      _type: "serviceCategory",
      title: cat.title,
      slug: { _type: "slug", current: cat.slug },
      order: cat.order,
    });
  }

  for (const svc of services) {
    const doc = {
      _id: svc._id,
      _type: "service",
      title: svc.title,
      slug: { _type: "slug", current: svc.slug },
      shortDescription: svc.shortDescription,
      duration: svc.duration,
      featured: svc.featured,
      order: svc.order,
      category: { _type: "reference", _ref: svc.categoryId },
    };
    if (svc.price !== null) doc.price = svc.price;
    tx.createOrReplace(doc);
  }

  await tx.commit();
  console.log(`✅  Creadas ${categories.length} categorías y ${services.length} servicios en Sanity.`);
  console.log("    Edita precios, duraciones y fotos en cualquier momento desde /studio");
}

seed().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
