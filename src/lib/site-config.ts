export const siteConfig = {
  name: "Amaya Rada Estética",
  shortName: "Amaya Rada",
  description:
    "Centro de estética avanzada en Murcia: higiene facial, dermapen, láser, masajes, tratamientos corporales y pedicura. Reserva online tu cita.",
  url: "https://amayarada.es",
  locale: "es-ES",
  contact: {
    phone: "+34604807886",
    phoneDisplay: "+34 604 807 886",
    whatsapp: "34604807886",
    email: "hola@amayarada.es",
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
  },
} as const;

export type SiteConfig = typeof siteConfig;
