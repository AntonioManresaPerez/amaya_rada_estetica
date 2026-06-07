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
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2, Clock, Euro } from "lucide-react";
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
  const day = date.getDay(); // 0=Dom, 6=Sáb
  if (day === 0) return [];
  const lastHour = day === 6 ? 13 : 19; // Sáb cierra a 14:00, ú último slot 13:00
  const slots: string[] = [];
  for (let h = 10; h <= lastHour; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return slots;
}

function isWeekend(date: Date) {
  return date.getDay() === 0; // Solo domingos cerrado
}

// ── Esquema del formulario de contacto ────────────────────────────────────

const ContactSchema = z.object({
  clientName: z.string().min(2, "Nombre demasiado corto").max(100),
  clientEmail: z.string().email("Email inválido"),
  clientPhone: z.string().optional(),
  notes: z.string().max(500).optional(),
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
    case "faciales":  return "from-vintage-lavender/25 to-lavender-veil/40";
    case "capilares": return "from-indigo-velvet/25 to-thistle/35";
    case "corporales": return "from-deep-space/15 to-thistle/30";
    default: return "from-thistle/25 to-lavender-veil/35";
  }
}

export function BookingForm({ services }: { services: SanityService[] }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isPending, startTransition] = useTransition();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = Array.from(
    new Map(
      services.filter((s) => s.category).map((s) => [s.category!.slug, s.category!])
    ).values()
  );

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category?.slug === activeCategory);

  const [selected, setSelected] = useState<SelectedService | null>(null);
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
    <div className={cn("mx-auto max-w-3xl px-6 py-12", step === 1 && "pb-32")}>
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
              <h2 className="font-serif text-2xl text-deep-space mb-5">
                ¿Qué tratamiento quieres reservar?
              </h2>

              {services.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay servicios disponibles en este momento.
                </p>
              ) : (
                <>
                  {/* Filtro de categoría */}
                  <div className="flex flex-wrap gap-2 mb-5">
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
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {filteredServices.map((s) => {
                      const isSelected = selected?._id === s._id;
                      const imgUrl = s.image
                        ? urlFor(s.image).width(480).height(220).url()
                        : null;
                      return (
                        <li key={s._id}>
                          <button
                            type="button"
                            onClick={() => handleServiceSelect(s)}
                            className={cn(
                              "relative w-full text-left rounded-xl border overflow-hidden min-h-[110px] transition-all",
                              isSelected
                                ? "border-indigo-velvet ring-2 ring-indigo-velvet/40"
                                : "border-thistle/40 hover:border-vintage-lavender hover:shadow-md"
                            )}
                          >
                            {/* Fondo degradado por categoría */}
                            <div
                              className={cn(
                                "absolute inset-0 bg-gradient-to-br",
                                categoryGradient(s.category?.slug)
                              )}
                            />
                            {/* Imagen con opacidad (si existe en Sanity) */}
                            {imgUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imgUrl}
                                alt=""
                                aria-hidden
                                className="absolute inset-0 w-full h-full object-cover opacity-25"
                              />
                            )}
                            {/* Overlay seleccionado */}
                            {isSelected && (
                              <div className="absolute inset-0 bg-indigo-velvet/10" />
                            )}

                            {/* Contenido */}
                            <div className="relative z-10 p-4">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-medium text-deep-space leading-tight">
                                  {s.title}
                                </p>
                                {isSelected && (
                                  <CheckCircle2 className="h-4 w-4 text-indigo-velvet flex-shrink-0 mt-0.5" />
                                )}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-deep-space/70">
                                {s.duration != null && (
                                  <span className="flex items-center gap-1 bg-white/60 rounded-full px-2 py-0.5 backdrop-blur-sm">
                                    <Clock className="h-3 w-3" />
                                    {s.duration} min
                                  </span>
                                )}
                                {s.price != null ? (
                                  <span className="flex items-center gap-1 bg-white/60 rounded-full px-2 py-0.5 backdrop-blur-sm">
                                    <Euro className="h-3 w-3" />
                                    {s.price}€
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 bg-white/60 rounded-full px-2 py-0.5 backdrop-blur-sm font-medium text-vintage-lavender">
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
                      <ul className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <li key={slot}>
                            <button
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={cn(
                                "w-full rounded-lg border py-2 text-sm font-medium transition-all",
                                selectedTime === slot
                                  ? "border-indigo-velvet bg-indigo-velvet text-white"
                                  : "border-thistle/40 bg-card hover:border-vintage-lavender"
                              )}
                            >
                              {slot}
                            </button>
                          </li>
                        ))}
                      </ul>
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
                className={cn(buttonVariants({ size: "default" }), "flex-shrink-0 gap-2")}
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
