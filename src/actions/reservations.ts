"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBookingConfirmation } from "@/lib/email/send";

// ── Esquema de validación ──────────────────────────────────────────────────

const ReservationSchema = z.object({
  clientName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  clientEmail: z.string().email("Email inválido"),
  clientPhone: z.string().optional(),
  serviceName: z.string().min(1, "Selecciona un servicio"),
  serviceSlug: z.string().optional(),
  durationMin: z.coerce.number().int().positive().optional(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
  notes: z.string().max(500).optional(),
  gdprConsent: z
    .boolean()
    .refine((v) => v === true, "Debes aceptar la política de privacidad"),
});

export type ReservationPayload = z.infer<typeof ReservationSchema>;
export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string };

// ── Rate limiting en memoria (3 envíos por IP por hora) ───────────────────

const rl = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rl.get(ip);
  if (!entry || entry.resetAt < now) {
    rl.set(ip, { count: 1, resetAt: now + 3_600_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// ── Server Actions ─────────────────────────────────────────────────────────

export async function createReservation(
  data: ReservationPayload
): Promise<ActionResult> {
  // Rate limit
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return {
      success: false,
      error: "Demasiadas solicitudes. Inténtalo en una hora.",
    };
  }

  // Validar
  const parsed = ReservationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const val = parsed.data;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return {
      success: false,
      error: "El sistema de reservas no está disponible en este momento.",
    };
  }

  // Verificar solapamiento con reservas existentes (duración + 15 min de margen)
  const { data: existingReservations } = await supabase
    .from("reservations")
    .select("appointment_time, duration_min")
    .eq("appointment_date", val.appointmentDate)
    .neq("status", "cancelled");

  const BUFFER = 10;
  const newStart = timeToMinutes(val.appointmentTime);
  const newEnd = newStart + (val.durationMin ?? 60); // sin buffer en el nuevo

  const hasConflict = (existingReservations ?? []).some(
    (r: { appointment_time: string; duration_min: number | null }) => {
      const existStart = timeToMinutes(r.appointment_time.slice(0, 5));
      const existEnd = existStart + (r.duration_min ?? 60) + BUFFER; // buffer solo en existentes
      return newStart < existEnd && existStart < newEnd;
    }
  );

  if (hasConflict) {
    return {
      success: false,
      error: "Ese horario se solapa con una cita existente. Por favor elige otro.",
    };
  }

  // Insertar
  const { data: row, error } = await supabase
    .from("reservations")
    .insert({
      client_name: val.clientName,
      client_email: val.clientEmail,
      client_phone: val.clientPhone ?? null,
      service_name: val.serviceName,
      service_slug: val.serviceSlug ?? null,
      duration_min: val.durationMin ?? 60,
      appointment_date: val.appointmentDate,
      appointment_time: val.appointmentTime + ":00",
      notes: val.notes ?? null,
      gdpr_consent: true,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[createReservation]", error.message);
    return {
      success: false,
      error: "Error al guardar la reserva. Por favor inténtalo de nuevo.",
    };
  }

  // Email (sin bloquear la respuesta)
  sendBookingConfirmation({
    to: val.clientEmail,
    clientName: val.clientName,
    serviceName: val.serviceName,
    date: val.appointmentDate,
    time: val.appointmentTime,
  }).catch(console.error);

  return { success: true, id: row.id };
}

// newServiceDuration: duración (en min) del servicio que el cliente quiere reservar.
// Se usa para detectar si empezar en un slot dado terminaría solapando con una reserva posterior.
export async function getOccupiedSlots(
  date: string,
  newServiceDuration = 60
): Promise<string[]> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return [];
  }

  const { data } = await supabase
    .from("reservations")
    .select("appointment_time, duration_min")
    .eq("appointment_date", date)
    .neq("status", "cancelled");

  const BUFFER = 10;
  const reservations = (
    data ?? []
  ).map((r: { appointment_time: string; duration_min: number | null }) => {
    const startMin = timeToMinutes(r.appointment_time.slice(0, 5));
    return {
      startMin,
      endMin: startMin + (r.duration_min ?? 60) + BUFFER,
    };
  });

  const blocked = new Set<string>();

  // Genera slots cada 30 min: mañana 10:00–13:30, tarde 16:00–19:30
  const slotMins: number[] = [];
  for (let t = 10 * 60; t <= 13 * 60 + 30; t += 30) slotMins.push(t);
  for (let t = 16 * 60; t <= 19 * 60 + 30; t += 30) slotMins.push(t);

  for (const slotStart of slotMins) {
    // Buffer solo en reservas existentes; el nuevo servicio no suma buffer.
    const slotEndNoBuffer = slotStart + newServiceDuration;
    const isBlocked = reservations.some(
      (r) => slotStart < r.endMin && r.startMin < slotEndNoBuffer
    );

    if (isBlocked) {
      const hh = Math.floor(slotStart / 60).toString().padStart(2, "0");
      const mm = (slotStart % 60).toString().padStart(2, "0");
      blocked.add(`${hh}:${mm}`);
    }
  }

  return Array.from(blocked);
}
