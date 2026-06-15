"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { format, addMonths } from "date-fns";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2, Clock, Euro, MessageCircle, AlertTriangle, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createReservation, getOccupiedSlots } from "@/actions/reservations";
import { urlFor } from "@/sanity/lib/image";
import type { SanityService } from "@/types/sanity";

// ── Tipos ──────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface SelectedService {
  _id: string;
  title: string;
  slug: string;
  durationMin: number;
  price?: number;
}

// ── Helpers de horario ─────────────────────────────────────────────────────

function generateSlots(date: Date): string[] {
  const day = date.getDay();
  if (day === 0) return [];

  const fmt = (totalMin: number) => {
    const h = Math.floor(totalMin / 60).toString().padStart(2, "0");
    const m = (totalMin % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };
  const range = (startMin: number, endMin: number) => {
    const slots: string[] = [];
    for (let t = startMin; t <= endMin; t += 30) slots.push(fmt(t));
    return slots;
  };

  // Mañana: 10:00 – 13:30 (cierre 14:00; el servicio puede terminar a las 14:xx)
  const morning = range(10 * 60, 13 * 60 + 30);
  if (day === 6) return morning;
  // Tarde L-V: 16:00 – 19:30 (cierre 20:00)
  return [...morning, ...range(16 * 60, 19 * 60 + 30)];
}

function isWeekend(date: Date) {
  return date.getDay() === 0; // Solo domingos cerrado
}

// Cierre de sesión en minutos: mañana→14:00, tarde→20:00
function sessionCloseMin(slotHour: number): number {
  return slotHour < 15 ? 14 * 60 : 20 * 60;
}

function wouldOverflowSession(slot: string, durationMin: number): boolean {
  const [h, m] = slot.split(":").map(Number);
  return h * 60 + m + durationMin > sessionCloseMin(h);
}

function formatEndTime(slot: string, durationMin: number): string {
  const [h, m] = slot.split(":").map(Number);
  const totalMin = h * 60 + m + durationMin;
  return `${Math.floor(totalMin / 60).toString().padStart(2, "0")}:${(totalMin % 60).toString().padStart(2, "0")}`;
}

function buildWhatsAppUrl(
  serviceName: string,
  durationMin: number,
  slot: string,
  date: Date
): string {
  const closeStr = parseInt(slot) < 15 ? "14:00" : "20:00";
  const endStr = formatEndTime(slot, durationMin);
  const dateStr = format(date, "d 'de' MMMM yyyy", { locale: es });
  const msg =
    `Hola! Me gustaría reservar "${serviceName}" a las ${slot} del ${dateStr}. ` +
    `El tratamiento dura ${durationMin} min y terminaría a las ${endStr}, ` +
    `sé que cerráis a las ${closeStr}. ¿Podéis confirmar si hay disponibilidad? Gracias 😊`;
  return `https://wa.me/34604807886?text=${encodeURIComponent(msg)}`;
}

// ── Esquema del formulario de contacto ────────────────────────────────────

const ContactSchema = z.object({
  clientName: z.string().min(2, "Nombre demasiado corto").max(100),
  clientEmail: z.string().email("Email inválido"),
  clientPhone: z.string().optional(),
  notes: z.string().max(500).optional(),
  website: z.string().max(0).optional(), // honeypot: debe quedar vacío
  gdprConsent: z
    .boolean()
    .refine((v) => v === true, "Debes aceptar la política de privacidad"),
});

type ContactFormData = z.infer<typeof ContactSchema>;

// ── Animación de transición de paso ───────────────────────────────────────

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

// ── Componente principal ───────────────────────────────────────────────────

function categoryGradient(slug?: string) {
  switch (slug) {
    case "faciales":  return "from-lavender-veil/30 via-lavender-veil/15 to-thistle/10";
    case "capilares": return "from-thistle/25 via-thistle/12 to-lavender-veil/10";
    case "corporales": return "from-vintage-lavender/20 via-thistle/12 to-lavender-veil/8";
    default: return "from-lavender-veil/25 via-thistle/12 to-vintage-lavender/8";
  }
}

function categoryAccentBar(slug?: string) {
  switch (slug) {
    case "faciales":  return "bg-vintage-lavender";
    case "capilares": return "bg-indigo-velvet";
    case "corporales": return "bg-thistle";
    default: return "bg-vintage-lavender";
  }
}

export function BookingForm({
  services,
  initialServiceSlug,
}: {
  services: SanityService[];
  initialServiceSlug?: string;
}) {
  const router = useRouter();

  const initialService = initialServiceSlug
    ? services.find((s) => s.slug === initialServiceSlug)
    : undefined;
  const [step, setStep] = useState<Step>(1);
  const [isPending, startTransition] = useTransition();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = Array.from(
    new Map(
      services.filter((s) => s.category).map((s) => [s.category!.slug, s.category!])
    ).values()
  );

  const filteredServices = services.filter((s) => {
    const matchesCategory = activeCategory === "all" || s.category?.slug === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || s.title.toLowerCase().includes(q) || s.category?.title.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const [selected, setSelected] = useState<SelectedService | null>(
    initialService
      ? {
          _id: initialService._id,
          title: initialService.title,
          slug: initialService.slug,
          durationMin: initialService.duration ?? 60,
          price: initialService.price,
        }
      : null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: standardSchemaResolver(ContactSchema),
    defaultValues: { gdprConsent: false },
  });

  // Cuando se selecciona una fecha, carga los huecos ocupados
  const handleDateSelect = useCallback(async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (!date) return;

    setLoadingSlots(true);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const occupied = await getOccupiedSlots(dateStr, selected?.durationMin ?? 60);
      setOccupiedSlots(occupied);
    } catch {
      setOccupiedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selected]);

  const handleServiceSelect = (service: SanityService) => {
    if (selected?._id === service._id) {
      setSelected(null);
      return;
    }
    setSelected({
      _id: service._id,
      title: service.title,
      slug: service.slug,
      durationMin: service.duration ?? 60,
      price: service.price,
    });
  };

  const onSubmit = (contactData: ContactFormData) => {
    if (!selected || !selectedDate || !selectedTime) return;
    setSubmitError("");

    startTransition(async () => {
      const result = await createReservation({
        clientName: contactData.clientName,
        clientEmail: contactData.clientEmail,
        clientPhone: contactData.clientPhone,
        serviceName: selected.title,
        serviceSlug: selected.slug,
        durationMin: selected.durationMin,
        appointmentDate: format(selectedDate, "yyyy-MM-dd"),
        appointmentTime: selectedTime,
        notes: contactData.notes,
        website: contactData.website,
        gdprConsent: contactData.gdprConsent,
      });

      if (result.success) {
        const params = new URLSearchParams({
          nombre: contactData.clientName,
          servicio: selected.title,
          fecha: format(selectedDate, "d 'de' MMMM yyyy", { locale: es }),
          hora: selectedTime,
        });
        router.push(`/reservar/confirmacion?${params.toString()}`);
      } else {
        setSubmitError(result.error);
      }
    });
  };

  const todaySlots = selectedDate ? generateSlots(selectedDate) : [];
  const availableSlots = todaySlots.filter((s) => !occupiedSlots.includes(s));

  return (
    <div className={cn("mx-auto px-6 py-12", step === 1 ? "max-w-6xl pb-32" : "max-w-3xl")}>
      {/* Indicador de pasos */}
      <nav aria-label="Pasos de reserva" className="mb-10">
        <ol className="flex items-center gap-4">
          {(["Servicio", "Fecha y hora", "Tus datos"] as const).map(
            (label, i) => {
              const num = (i + 1) as Step;
              const done = step > num;
              const active = step === num;
              return (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                      done
                        ? "bg-vintage-lavender text-white"
                        : active
                          ? "bg-indigo-velvet text-white"
                          : "bg-thistle/40 text-muted-foreground"
                    )}
                    aria-current={active ? "step" : undefined}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : num}
                  </span>
                  <span
                    className={cn(
                      "text-sm hidden sm:block",
                      active ? "font-medium text-deep-space" : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                  {i < 2 && (
                    <span className="mx-2 h-px w-8 bg-thistle/40 hidden sm:block" />
                  )}
                </li>
              );
            }
          )}
        </ol>
      </nav>

      {/* Contenido del paso */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {/* ── Paso 1: Servicio ───────────────────────────────── */}
          {step === 1 && (
            <div>
              <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-end sm:gap-4">
                <h2 className="font-serif text-2xl text-deep-space shrink-0">
                  ¿Qué tratamiento quieres reservar?
                </h2>
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Buscar…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-thistle/40 bg-card pl-8 pr-3 py-1.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-vintage-lavender focus-visible:border-vintage-lavender placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              {services.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay servicios disponibles en este momento.
                </p>
              ) : (
                <>
                  {/* Filtro de categoría + buscador */}
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <button
                      type="button"
                      onClick={() => setActiveCategory("all")}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                        activeCategory === "all"
                          ? "bg-indigo-velvet text-white"
                          : "bg-thistle/20 text-deep-space hover:bg-thistle/40"
                      )}
                    >
                      Todos ({services.length})
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => setActiveCategory(cat.slug)}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                          activeCategory === cat.slug
                            ? "bg-indigo-velvet text-white"
                            : "bg-thistle/20 text-deep-space hover:bg-thistle/40"
                        )}
                      >
                        {cat.title} ({services.filter((s) => s.category?.slug === cat.slug).length})
                      </button>
                    ))}
                  </div>

                  {/* Cuadrícula de servicios */}
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((s) => {
                      const isSelected = selected?._id === s._id;
                      const imgUrl = s.image
                        ? urlFor(s.image).width(480).height(220).url()
                        : null;
                      return (
                        <li key={s._id} className="relative">
                          <button
                            type="button"
                            onClick={() => handleServiceSelect(s)}
                            className={cn(
                              "relative w-full text-left rounded-2xl border overflow-hidden min-h-[130px] transition-all duration-300",
                              isSelected
                                ? "border-indigo-velvet ring-2 ring-indigo-velvet/30 shadow-xl scale-[1.02]"
                                : "border-thistle/30 hover:border-vintage-lavender/60 hover:shadow-2xl hover:shadow-deep-space/15 hover:scale-[1.05] hover:z-10"
                            )}
                          >
                            {/* Fondo degradado por categoría */}
                            <div
                              className={cn(
                                "absolute inset-0 bg-linear-to-br",
                                categoryGradient(s.category?.slug)
                              )}
                            />
                            {/* Franja de color superior por categoría */}
                            <div className={cn("absolute top-0 left-0 right-0 h-[3px]", categoryAccentBar(s.category?.slug))} />
                            {/* Imagen real de Sanity (si existe) */}
                            {imgUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imgUrl}
                                alt=""
                                aria-hidden
                                className="absolute inset-0 w-full h-full object-cover opacity-20"
                              />
                            )}
                            {/* Overlay seleccionado */}
                            {isSelected && (
                              <div className="absolute inset-0 bg-indigo-velvet/8" />
                            )}

                            {/* Contenido */}
                            <div className="relative z-10 p-4 pt-5 flex flex-col justify-between h-full min-h-[130px]">
                              <div>
                                {s.category && (
                                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-deep-space/45 mb-1.5">
                                    {s.category.title}
                                  </p>
                                )}
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-serif font-semibold text-deep-space leading-snug text-[15px]">
                                    {s.title}
                                  </p>
                                  {isSelected && (
                                    <CheckCircle2 className="h-4 w-4 text-indigo-velvet shrink-0 mt-0.5" />
                                  )}
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-deep-space/65">
                                {s.duration != null && (
                                  <span className="flex items-center gap-1 bg-white/55 rounded-full px-2 py-0.5">
                                    <Clock className="h-3 w-3" />
                                    {s.duration} min
                                  </span>
                                )}
                                {s.price != null ? (
                                  <span className="flex items-center gap-1 bg-white/55 rounded-full px-2 py-0.5">
                                    <Euro className="h-3 w-3" />
                                    {s.price}€
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 bg-white/55 rounded-full px-2 py-0.5 font-medium text-vintage-lavender">
                                    Gratis
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* ── Paso 2: Fecha y hora ───────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-2xl text-deep-space mb-6">
                Elige fecha y hora
              </h2>
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Calendario */}
                <div className="flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    locale={es}
                    disabled={[
                      { before: new Date() },
                      { dayOfWeek: [0] },
                    ]}
                    startMonth={new Date()}
                    endMonth={addMonths(new Date(), 3)}
                    captionLayout="label"
                  />
                </div>

                {/* Slots de hora */}
                <div>
                  {!selectedDate ? (
                    <p className="text-sm text-muted-foreground">
                      Selecciona una fecha para ver los huecos disponibles.
                    </p>
                  ) : loadingSlots ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Comprobando disponibilidad…
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No quedan huecos para este día. Prueba con otra fecha.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-deep-space mb-3">
                        Huecos disponibles el{" "}
                        {format(selectedDate, "d 'de' MMMM", { locale: es })}:
                      </p>
                      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {availableSlots.map((slot) => {
                          const overflow = selected
                            ? wouldOverflowSession(slot, selected.durationMin)
                            : false;
                          return (
                            <li key={slot}>
                              <button
                                type="button"
                                onClick={() => setSelectedTime(slot)}
                                className={cn(
                                  "relative w-full rounded-lg border py-2 text-sm font-medium transition-all",
                                  selectedTime === slot
                                    ? overflow
                                      ? "border-amber-400 bg-amber-400 text-white"
                                      : "border-indigo-velvet bg-indigo-velvet text-white"
                                    : overflow
                                      ? "border-amber-300/70 bg-amber-50 text-amber-800 hover:border-amber-400"
                                      : "border-thistle/40 bg-card hover:border-vintage-lavender"
                                )}
                              >
                                {slot}
                                {overflow && (
                                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400">
                                    <AlertTriangle className="h-2 w-2 text-white" />
                                  </span>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Aviso WhatsApp si el slot seleccionado se pasa del cierre */}
                      {selectedTime && selected && wouldOverflowSession(selectedTime, selected.durationMin) && (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
                          <p className="font-medium text-amber-800">
                            Este tratamiento ({selected.durationMin} min) terminaría a las{" "}
                            {formatEndTime(selectedTime, selected.durationMin)}, pasado el horario de cierre (
                            {parseInt(selectedTime) < 15 ? "14:00" : "20:00"}).
                          </p>
                          <p className="mt-1 text-amber-700">
                            Escríbenos por WhatsApp y te confirmamos si podemos atenderte a esa hora.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Paso 3: Datos de contacto ──────────────────────── */}
          {step === 3 && (
            <div>
              <h2 className="font-serif text-2xl text-deep-space mb-2">
                Tus datos
              </h2>
              {selected && selectedDate && selectedTime && (
                <div className="mb-6 rounded-xl border border-thistle/40 bg-lavender-veil/30 p-4 text-sm">
                  <p className="font-medium text-deep-space">{selected.title}</p>
                  <p className="text-muted-foreground">
                    {format(selectedDate, "d 'de' MMMM yyyy", { locale: es })}{" "}
                    a las {selectedTime}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Honeypot anti-bot — invisible y no tabulable; un humano nunca lo rellena */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  {...register("website")}
                />

                {/* Nombre */}
                <div className="space-y-1">
                  <label
                    htmlFor="clientName"
                    className="text-sm font-medium text-deep-space"
                  >
                    Nombre completo *
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    autoComplete="name"
                    className={cn(
                      "w-full rounded-lg border bg-card px-4 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-vintage-lavender",
                      errors.clientName
                        ? "border-destructive"
                        : "border-thistle/60"
                    )}
                    {...register("clientName")}
                  />
                  {errors.clientName && (
                    <p className="text-xs text-destructive">
                      {errors.clientName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label
                    htmlFor="clientEmail"
                    className="text-sm font-medium text-deep-space"
                  >
                    Email *
                  </label>
                  <input
                    id="clientEmail"
                    type="email"
                    autoComplete="email"
                    className={cn(
                      "w-full rounded-lg border bg-card px-4 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-vintage-lavender",
                      errors.clientEmail
                        ? "border-destructive"
                        : "border-thistle/60"
                    )}
                    {...register("clientEmail")}
                  />
                  {errors.clientEmail && (
                    <p className="text-xs text-destructive">
                      {errors.clientEmail.message}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-1">
                  <label
                    htmlFor="clientPhone"
                    className="text-sm font-medium text-deep-space"
                  >
                    Teléfono{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </label>
                  <input
                    id="clientPhone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full rounded-lg border border-thistle/60 bg-card px-4 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-vintage-lavender"
                    {...register("clientPhone")}
                  />
                </div>

                {/* Notas */}
                <div className="space-y-1">
                  <label
                    htmlFor="notes"
                    className="text-sm font-medium text-deep-space"
                  >
                    Comentarios{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Alergias, preferencias, primera vez…"
                    className="w-full rounded-lg border border-thistle/60 bg-card px-4 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-vintage-lavender resize-none"
                    {...register("notes")}
                  />
                </div>

                {/* RGPD */}
                <div className="space-y-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-thistle accent-indigo-velvet"
                      {...register("gdprConsent")}
                    />
                    <span className="text-sm text-muted-foreground">
                      Acepto la{" "}
                      <a
                        href="/privacidad"
                        className="text-vintage-lavender underline underline-offset-2 hover:text-indigo-velvet"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        política de privacidad
                      </a>{" "}
                      y el tratamiento de mis datos para gestionar mi cita.*
                    </span>
                  </label>
                  {errors.gdprConsent && (
                    <p className="text-xs text-destructive">
                      {errors.gdprConsent.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full gap-2",
                    isPending && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isPending ? "Enviando…" : "Confirmar reserva"}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navegación pasos 2 y 3 */}
      {step > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as Step)}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
          >
            <ChevronLeft className="h-4 w-4" />
            Atrás
          </button>

          {step === 2 && (
            selectedDate && selectedTime && selected &&
            wouldOverflowSession(selectedTime, selected.durationMin) ? (
              <a
                href={buildWhatsAppUrl(selected.title, selected.durationMin, selectedTime, selectedDate)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "gap-2 bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 text-white"
                )}
              >
                <MessageCircle className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(3)}
                className={cn(
                  buttonVariants({ size: "default" }),
                  "gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      )}

      {/* Barra sticky paso 1: aparece al seleccionar un servicio */}
      <AnimatePresence>
        {step === 1 && selected && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-thistle/30 bg-white/95 backdrop-blur-sm px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="mx-auto max-w-3xl flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-deep-space truncate">{selected.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  {selected.durationMin && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selected.durationMin} min
                    </span>
                  )}
                  {selected.price != null && (
                    <span className="flex items-center gap-1">
                      <Euro className="h-3 w-3" />
                      {selected.price}€
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={cn(buttonVariants({ size: "default" }), "shrink-0 gap-2")}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
