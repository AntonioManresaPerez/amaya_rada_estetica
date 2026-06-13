// Fondo ambiental para las páginas internas (servicios, blog, galería,
// contacto…). Aurora muy suave y lenta en tono de marca, detrás del contenido
// (-z-10) y fija al viewport. Decorativa, no interactiva.
export function PageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden motion-reduce:hidden">
      <span className="page-aura page-aura-1" />
      <span className="page-aura page-aura-2" />
      <span className="page-aura page-aura-3" />
    </div>
  );
}
