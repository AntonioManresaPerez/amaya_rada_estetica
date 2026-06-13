// Fotos de respaldo (Pexels) para servicios sin imagen propia en Sanity.
// Todas verificadas visualmente · crop en servidor para no descargar de más.

const CDN = "https://images.pexels.com/photos";

export const pexels = (id: number, w = 600, h = 450) =>
  `${CDN}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

// Cada foto encaja con el tratamiento. Claves = slugs reales de Sanity
// y slugs del fallback estático.
const SERVICE_PHOTOS: Record<string, number> = {
  // Servicios de Sanity
  valoracion: 5701545,
  "higiene-facial-profunda": 30809943,
  hidrafacial: 8312823,
  "dermapen-facial": 29648626,
  "hidralips-dermapen-hidratacion": 9157201,
  "hidralips-color-dermapen": 7290082,
  "ojeras-dermapen": 5313577,
  "radiofrecuencia-facial": 4586726,
  "masaje-facial-kobido": 6628815,
  "maderoterapia-facial": 5659020,
  "peeling-facial": 36930299,
  "facial-espiculas": 12556701,
  "capilar-dermapen-alta-frecuencia": 28994388,
  "despigmentante-manos-axilas": 3762842,
  // Fallback estático
  dermapen: 29648626,
  "higiene-facial": 30809943,
  laser: 4586726,
  pedicura: 34930123,
  maderoterapia: 6628649,
  presoterapia: 5888062,
  manchas: 5701545,
  vacum: 8312823,
};

// Pool genérico para cualquier slug no mapeado → ninguna tarjeta queda vacía.
const PHOTO_POOL = [30809943, 8312823, 29648626, 6628815, 36930299, 5701545, 5659020, 12556701];

// Devuelve siempre un id de foto: el mapeado si existe, o uno del pool
// elegido de forma determinista a partir del slug (mismo slug → misma foto).
export function servicePhotoId(slug: string): number {
  const mapped = SERVICE_PHOTOS[slug];
  if (mapped) return mapped;
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return PHOTO_POOL[h % PHOTO_POOL.length];
}
