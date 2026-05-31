import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendReminderEmail } from "@/lib/email/send";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verificar el secreto del cron de Vercel
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().slice(0, 10);

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("client_email, client_name, service_name, appointment_date, appointment_time")
    .eq("appointment_date", dateStr)
    .in("status", ["pending", "confirmed"])
    .is("reminded_at", null);

  if (error) {
    console.error("[cron/reminders]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  for (const r of reservations ?? []) {
    try {
      await sendReminderEmail({
        to: r.client_email,
        clientName: r.client_name,
        serviceName: r.service_name,
        date: r.appointment_date,
        time: r.appointment_time.slice(0, 5),
      });
      // Marcar como recordada para no reenviar
      await supabase
        .from("reservations")
        .update({ reminded_at: new Date().toISOString() })
        .eq("appointment_date", r.appointment_date)
        .eq("appointment_time", r.appointment_time)
        .eq("client_email", r.client_email);
      sent++;
    } catch (e) {
      console.error("[cron/reminders] email failed:", e);
    }
  }

  return NextResponse.json({ sent, date: dateStr });
}
