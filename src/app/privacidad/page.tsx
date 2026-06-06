import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidad — Amaya Rada Estética",
  description: "Información sobre el tratamiento de tus datos personales en Amaya Rada Estética.",
  robots: { index: false },
};

export default function PrivacidadPage() {
  return (
    <main className="flex-1 pt-24">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl text-deep-space mb-3">Política de privacidad</h1>
        <p className="text-sm text-muted-foreground mb-12">
          Última actualización: junio de 2026
        </p>

        <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-indigo-velvet prose-a:text-vintage-lavender prose-a:no-underline hover:prose-a:underline leading-relaxed space-y-8">

          <section>
            <h2 className="text-2xl mb-3">1. Responsable del tratamiento</h2>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Titular:</strong> Amaya Rada<br />
              <strong className="text-foreground">Nombre comercial:</strong> {siteConfig.name}<br />
              <strong className="text-foreground">Dirección:</strong> {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}, {siteConfig.address.postalCode} {siteConfig.address.addressRegion}<br />
              <strong className="text-foreground">Email:</strong>{" "}
              <Link href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</Link>
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-3">2. Datos que recopilamos</h2>
            <p className="text-muted-foreground">
              Cuando realizas una reserva de cita a través de nuestra web, recopilamos los siguientes datos:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>Servicio solicitado, fecha y hora de la cita</li>
              <li>Comentarios o indicaciones que tú facilites voluntariamente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-3">3. Finalidad y base legal</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-thistle/40">
                    <th className="text-left py-2 pr-4 text-indigo-velvet font-medium">Finalidad</th>
                    <th className="text-left py-2 text-indigo-velvet font-medium">Base legal</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-thistle/20">
                    <td className="py-2 pr-4">Gestionar tu reserva de cita</td>
                    <td className="py-2">Ejecución de un contrato (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr className="border-b border-thistle/20">
                    <td className="py-2 pr-4">Enviarte el email de confirmación y recordatorio</td>
                    <td className="py-2">Ejecución de un contrato (art. 6.1.b RGPD)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Atender consultas de contacto</td>
                    <td className="py-2">Consentimiento (art. 6.1.a RGPD)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl mb-3">4. Conservación de los datos</h2>
            <p className="text-muted-foreground">
              Conservamos los datos de reserva durante <strong className="text-foreground">3 años</strong> desde la fecha de la cita, salvo que solicites su supresión antes. Los datos de contacto se eliminan en cuanto dejan de ser necesarios para el fin para el que fueron recogidos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-3">5. Destinatarios de los datos</h2>
            <p className="text-muted-foreground mb-2">
              Tus datos se comparten únicamente con los proveedores técnicos necesarios para prestar el servicio, todos ellos con garantías adecuadas bajo el RGPD:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Supabase Inc.</strong> — almacenamiento de reservas (servidores en la UE)</li>
              <li><strong className="text-foreground">Resend Inc.</strong> — envío de emails transaccionales</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              No vendemos ni cedemos tus datos a terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-3">6. Tus derechos</h2>
            <p className="text-muted-foreground mb-2">
              Puedes ejercer en cualquier momento los siguientes derechos enviando un email a{" "}
              <Link href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</Link>:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Acceso:</strong> conocer qué datos tenemos sobre ti</li>
              <li><strong className="text-foreground">Rectificación:</strong> corregir datos incorrectos</li>
              <li><strong className="text-foreground">Supresión:</strong> solicitar que borremos tus datos</li>
              <li><strong className="text-foreground">Portabilidad:</strong> recibir tus datos en formato estructurado</li>
              <li><strong className="text-foreground">Oposición y limitación:</strong> oponerte a ciertos tratamientos</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Si consideras que tus derechos no se han atendido correctamente, puedes reclamar ante la{" "}
              <Link href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
                Agencia Española de Protección de Datos (AEPD)
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-3">7. Seguridad</h2>
            <p className="text-muted-foreground">
              Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos: conexión cifrada HTTPS, acceso restringido a la base de datos mediante roles y políticas de seguridad a nivel de fila (RLS).
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-3">8. Cambios en esta política</h2>
            <p className="text-muted-foreground">
              Podemos actualizar esta política para adaptarla a cambios legales o técnicos. Te notificaremos cualquier cambio relevante por email si tienes una reserva activa.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-thistle/30">
          <Link href="/" className="text-vintage-lavender hover:text-indigo-velvet transition-colors text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
