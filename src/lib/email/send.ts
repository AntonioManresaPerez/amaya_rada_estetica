import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = `${siteConfig.name} <citas@amayarada.es>`;

function formatDate(date: string, time: string) {
  return new Date(`${date}T${time}`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface BookingParams {
  to: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
}

export async function sendBookingConfirmation(params: BookingParams) {
  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Email] Resend sin configurar. Se enviaría a:", params.to);
    }
    return;
  }

  const { to, clientName, serviceName, date, time } = params;
  const formattedDate = formatDate(date, time);

  await Promise.all([
    // Confirmación al cliente
    resend.emails.send({
      from: FROM,
      to,
      subject: `Tu cita está confirmada — ${serviceName}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#f9f5fc;">
          <h1 style="color:#4a306d;font-size:28px;margin-bottom:8px;">Tu cita está confirmada ✓</h1>
          <p style="color:#555;margin-bottom:28px;">Hola <strong>${clientName}</strong>, aquí tienes los detalles:</p>
          <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:28px;border:1px solid #d3bccc;">
            <p style="margin:0 0 10px;color:#333;"><strong>Servicio:</strong> ${serviceName}</p>
            <p style="margin:0 0 10px;color:#333;"><strong>Fecha:</strong> ${formattedDate}</p>
            <p style="margin:0;color:#333;"><strong>Hora:</strong> ${time}</p>
          </div>
          <p style="color:#777;font-size:14px;">
            ¿Necesitas cancelar o cambiar la cita? Escríbenos por WhatsApp:
            <a href="https://wa.me/${siteConfig.contact.whatsapp}" style="color:#a167a5;">
              ${siteConfig.contact.phoneDisplay}
            </a>
          </p>
          <hr style="border:none;border-top:1px solid #e8d7f1;margin:28px 0;" />
          <p style="color:#aaa;font-size:12px;">${siteConfig.name} · ${siteConfig.address.addressLocality}</p>
        </div>
      `,
    }),
    // Aviso a Amaya
    resend.emails.send({
      from: FROM,
      to: siteConfig.contact.email,
      subject: `Nueva cita: ${serviceName} — ${formattedDate}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;padding:20px;">
          <h2 style="color:#4a306d;">Nueva reserva recibida</h2>
          <ul style="line-height:2;">
            <li><strong>Cliente:</strong> ${clientName}</li>
            <li><strong>Email:</strong> ${to}</li>
            <li><strong>Servicio:</strong> ${serviceName}</li>
            <li><strong>Fecha:</strong> ${formattedDate}</li>
            <li><strong>Hora:</strong> ${time}</li>
          </ul>
        </div>
      `,
    }),
  ]);
}

export async function sendReminderEmail(params: BookingParams) {
  if (!resend) return;
  const { to, clientName, serviceName, date, time } = params;
  const formattedDate = formatDate(date, time);

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Recordatorio: tu cita mañana — ${serviceName}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#f9f5fc;">
        <h1 style="color:#4a306d;font-size:24px;">Recuerda tu cita de mañana</h1>
        <p style="color:#555;">Hola <strong>${clientName}</strong>, te recordamos que mañana tienes:</p>
        <div style="background:#fff;border-radius:12px;padding:24px;margin:20px 0;border:1px solid #d3bccc;">
          <p style="margin:0 0 10px;color:#333;"><strong>Servicio:</strong> ${serviceName}</p>
          <p style="margin:0 0 10px;color:#333;"><strong>Fecha:</strong> ${formattedDate}</p>
          <p style="margin:0;color:#333;"><strong>Hora:</strong> ${time}</p>
        </div>
        <p style="color:#777;font-size:14px;">
          Si no puedes asistir, avísanos por
          <a href="https://wa.me/${siteConfig.contact.whatsapp}" style="color:#a167a5;">WhatsApp</a>.
        </p>
        <hr style="border:none;border-top:1px solid #e8d7f1;margin:24px 0;" />
        <p style="color:#aaa;font-size:12px;">${siteConfig.name}</p>
      </div>
    `,
  });
}
