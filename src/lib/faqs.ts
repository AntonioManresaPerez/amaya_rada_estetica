import { siteConfig } from "@/lib/site-config";

export interface Faq {
  question: string;
  answer: string;
}

// Preguntas frecuentes de la home. Son editables: ajusta el texto a tu realidad
// cuando quieras. Aparecen en la web y generan rich results (FAQPage) en Google.
export const DEFAULT_FAQS: Faq[] = [
  {
    question: "¿Cómo puedo reservar una cita?",
    answer:
      "Puedes reservar online desde esta web en menos de 2 minutos, o escribirnos por WhatsApp. Eliges tratamiento, día y hora y te confirmamos.",
  },
  {
    question: "¿La primera consulta tiene coste?",
    answer:
      "No. La primera consulta de valoración es gratuita y sin compromiso: estudiamos tu piel y te recomendamos el tratamiento más adecuado.",
  },
  {
    question: "¿Dónde está el centro?",
    answer: `Estamos en ${siteConfig.address.streetAddress}, ${siteConfig.address.addressLocality} (${siteConfig.address.addressRegion}). Tienes el mapa y cómo llegar en la página de Contacto.`,
  },
  {
    question: "¿Puedo anular o cambiar mi cita?",
    answer:
      "Sí. Avísanos con antelación por WhatsApp o teléfono y reprogramamos tu cita sin problema.",
  },
  {
    question: "¿Tenéis bonos o tarjetas regalo?",
    answer:
      "Sí, ofrecemos bonos de sesiones y tarjetas regalo. Escríbenos por WhatsApp y te informamos de las opciones disponibles.",
  },
];
