export const siteConfig = {
  name: "Amaya Rada Estética",
  shortName: "Amaya Rada",
  description:
    "Centro de estética avanzada en Murcia: higiene facial, dermapen, láser, masajes, tratamientos corporales y pedicura. Reserva online tu cita.",
  url: "https://amayarada.es",
  locale: "es-ES",
  contact: {
    phone: "+34645625036",
    phoneDisplay: "+34645625036",
    whatsapp: "34645625036",
    email: "dianarada16@hotmail.com",
  },
  address: {
    streetAddress: "Calle Párroco Salvador Pérez, 3",
    addressLocality: "Santiago el Mayor",
    addressRegion: "Murcia",
    postalCode: "30012",
    addressCountry: "ES",
  },
  geo: {
    latitude: 37.9922,
    longitude: -1.1307,
  },
  hours: [
    { day: "Monday",    open: "10:00", close: "14:00" },
    { day: "Monday",    open: "16:00", close: "20:00" },
    { day: "Tuesday",   open: "10:00", close: "14:00" },
    { day: "Tuesday",   open: "16:00", close: "20:00" },
    { day: "Wednesday", open: "10:00", close: "14:00" },
    { day: "Wednesday", open: "16:00", close: "20:00" },
    { day: "Thursday",  open: "10:00", close: "14:00" },
    { day: "Thursday",  open: "16:00", close: "20:00" },
    { day: "Friday",    open: "10:00", close: "14:00" },
    { day: "Friday",    open: "16:00", close: "20:00" },
    { day: "Saturday",  open: "10:00", close: "14:00" },
  ],
  social: {
    instagram: "https://www.instagram.com/amaya_rada_estetica/",
    tiktok: "https://www.tiktok.com/@amaya_rada_estetica",
    // Pega aquí el enlace a tu ficha de Google Business para reforzar el SEO local.
    google: "",
  },
  // Valoración de Google. Rellena con tus datos REALES para activar las
  // estrellas en la web y en los resultados de búsqueda (aggregateRating).
  // Déjalo en 0 mientras no tengas reseñas: así no se muestra nada.
  reviews: {
    rating: 0, // p. ej. 4.9
    count: 0, // nº de reseñas, p. ej. 87
    url: "", // enlace a tu ficha/reseñas de Google
  },
} as const;

export type SiteConfig = typeof siteConfig;
