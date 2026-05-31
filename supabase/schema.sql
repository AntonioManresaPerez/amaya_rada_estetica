-- ============================================================
-- Amaya Rada Estética — Supabase schema
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS reservations (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name      text        NOT NULL,
  client_email     text        NOT NULL,
  client_phone     text,
  service_name     text        NOT NULL,
  service_slug     text,
  appointment_date date        NOT NULL,
  appointment_time time        NOT NULL,
  duration_min     integer     NOT NULL DEFAULT 60,
  notes            text,
  status           text        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  gdpr_consent     boolean     NOT NULL DEFAULT false,
  reminded_at      timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS reservations_date_time_idx
  ON reservations (appointment_date, appointment_time);

CREATE INDEX IF NOT EXISTS reservations_status_idx
  ON reservations (status);

CREATE INDEX IF NOT EXISTS reservations_email_idx
  ON reservations (client_email);

-- Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Política: solo usuarios autenticados (Amaya) pueden ver reservas
CREATE POLICY "Authenticated users can view reservations"
  ON reservations FOR SELECT
  TO authenticated
  USING (true);

-- Política: solo usuarios autenticados pueden actualizar estado
CREATE POLICY "Authenticated users can update reservations"
  ON reservations FOR UPDATE
  TO authenticated
  USING (true);

-- Política: el rol service_role (Server Actions) puede hacer todo
-- (implícito: service_role bypasses RLS by default)

-- Vista pública para consultar huecos ocupados sin exponer datos personales
CREATE OR REPLACE VIEW public_occupied_slots AS
  SELECT appointment_date, appointment_time
  FROM reservations
  WHERE status != 'cancelled';

GRANT SELECT ON public_occupied_slots TO anon;
