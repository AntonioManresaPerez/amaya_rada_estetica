import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Cookies — Amaya Rada Estética",
  description: "Información sobre el uso de cookies en amayarada.es.",
  robots: { index: false },
};

export default function CookiesPage() {
  return (
    <main className="flex-1 pt-24">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl text-deep-space mb-3">Política de cookies</h1>
        <p className="text-sm text-muted-foreground mb-12">
          Última actualización: junio de 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="font-serif text-2xl text-indigo-velvet mb-3">¿Qué son las cookies?</h2>
            <p className="text-muted-foreground">
              Las cookies son pequeños ficheros de texto que un sitio web almacena en tu dispositivo cuando lo visitas. Sirven para que el sitio funcione correctamente, recordar tus preferencias o analizar cómo se usa.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo-velvet mb-3">Cookies que utilizamos</h2>
            <p className="text-muted-foreground mb-4">
              <strong className="text-foreground">Esta web solo utiliza cookies técnicas estrictamente necesarias.</strong>{" "}
              No usamos cookies de seguimiento, publicidad ni análisis de terceros.
            </p>
            <div className="overflow-x-auto rounded-xl border border-thistle/40">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-lavender-veil/30">
                  <tr>
                    <th className="text-left p-3 text-indigo-velvet font-medium">Cookie</th>
                    <th className="text-left p-3 text-indigo-velvet font-medium">Tipo</th>
                    <th className="text-left p-3 text-indigo-velvet font-medium">Finalidad</th>
                    <th className="text-left p-3 text-indigo-velvet font-medium">Duración</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground divide-y divide-thistle/20">
                  <tr>
                    <td className="p-3 font-mono text-xs">__next_hmr_refresh</td>
                    <td className="p-3">Técnica</td>
                    <td className="p-3">Funcionamiento interno del framework web</td>
                    <td className="p-3">Sesión</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">sb-*</td>
                    <td className="p-3">Técnica</td>
                    <td className="p-3">Gestión de sesión para el sistema de reservas</td>
                    <td className="p-3">Sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              Las cookies técnicas están exentas de consentimiento según la Ley 34/2002 (LSSI-CE) y el RGPD, ya que son imprescindibles para el funcionamiento del servicio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo-velvet mb-3">Cookies de terceros</h2>
            <p className="text-muted-foreground">
              La página de contacto incluye un mapa de <strong className="text-foreground">Google Maps</strong> cargado con <code className="bg-lavender-veil/40 px-1 rounded text-xs">loading=&quot;lazy&quot;</code>. Google puede establecer sus propias cookies cuando el mapa se carga. Consulta la{" "}
              <Link
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vintage-lavender hover:text-indigo-velvet transition-colors"
              >
                política de privacidad de Google
              </Link>{" "}
              para más información.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo-velvet mb-3">Cómo gestionar las cookies</h2>
            <p className="text-muted-foreground mb-2">
              Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que bloquear las cookies técnicas puede afectar al funcionamiento del formulario de reservas.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>
                <Link href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-vintage-lavender hover:text-indigo-velvet transition-colors">
                  Chrome
                </Link>
              </li>
              <li>
                <Link href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-vintage-lavender hover:text-indigo-velvet transition-colors">
                  Firefox
                </Link>
              </li>
              <li>
                <Link href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-vintage-lavender hover:text-indigo-velvet transition-colors">
                  Safari
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo-velvet mb-3">Contacto</h2>
            <p className="text-muted-foreground">
              Para cualquier consulta sobre el uso de cookies, escríbenos a{" "}
              <Link href={`mailto:${siteConfig.contact.email}`} className="text-vintage-lavender hover:text-indigo-velvet transition-colors">
                {siteConfig.contact.email}
              </Link>
              .
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-thistle/30 flex gap-6">
          <Link href="/privacidad" className="text-vintage-lavender hover:text-indigo-velvet transition-colors text-sm">
            Política de privacidad
          </Link>
          <Link href="/" className="text-vintage-lavender hover:text-indigo-velvet transition-colors text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
