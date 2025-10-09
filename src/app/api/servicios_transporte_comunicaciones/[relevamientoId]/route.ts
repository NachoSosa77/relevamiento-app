/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface ServicioTransporte extends RowDataPacket {
  id: number;
  id_servicio: string;
  servicio: string;
  en_predio: string | null;
  disponibilidad: string | null;
  distancia: string | null;
  relevamiento_id: number;
  created_at: string;
  updated_at: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  try {
    const { relevamientoId } = await params;
    if (!relevamientoId) {
      return NextResponse.json(
        { message: "Falta relevamientoId" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query<ServicioTransporte[]>(
      `SELECT id, id_servicio, servicio, en_predio, disponibilidad, distancia, relevamiento_id,
              created_at, updated_at
       FROM servicios_transporte_comunicaciones
       WHERE relevamiento_id = ?
       ORDER BY id_servicio`,
      [Number(relevamientoId)]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ servicios: rows }, { status: 200 });
  } catch (err: any) {
    console.error("GET stc error:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  } finally {
  }
}

type Item = {
  id_servicio: string; // "3.1", "3.2", ...
  servicio: string; // "Pavimento", etc. (si cambia en el futuro, también lo actualizamos)
  en_predio?: string | null;
  disponibilidad?: string | null;
  distancia?: string | null;
};

const normalizeYesNo = (v?: string | null) => {
  if (v == null) return null;
  const t = String(v).trim().toLowerCase();
  if (t === "sí" || t === "si" || t === "s") return "Si";
  if (t === "no" || t === "n") return "No";
  return String(v).trim(); // deja otros valores (p.ej. "Continua", "Diaria")
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  try {
    const { relevamientoId } = await params;
    if (!relevamientoId) {
      return NextResponse.json(
        { message: "Falta relevamientoId" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const servicios: Item[] = body?.serviciosTransporte;
    if (!Array.isArray(servicios)) {
      return NextResponse.json(
        { message: "Se espera { serviciosTransporte: Item[] }" },
        { status: 400 }
      );
    }

    // Validación mínima
    for (const s of servicios) {
      if (!s?.id_servicio || !s?.servicio) {
        return NextResponse.json(
          { message: "Cada item requiere id_servicio y servicio" },
          { status: 400 }
        );
      }
    }

    // Normalización de valores (opcional pero recomendado)
    const norm = servicios.map((s) => ({
      ...s,
      en_predio: s.en_predio == null ? null : String(s.en_predio).trim(),
      disponibilidad: normalizeYesNo(s.disponibilidad),
      distancia: s.distancia == null ? null : String(s.distancia).trim(),
    }));

    // UPSERT por (relevamiento_id, id_servicio)
    const placeholders = norm.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    const values: any[] = [];
    for (const s of norm) {
      values.push(
        s.id_servicio,
        s.servicio,
        s.en_predio,
        s.disponibilidad,
        s.distancia,
        Number(relevamientoId)
      );
    }

    await pool.query(
      `
      INSERT INTO servicios_transporte_comunicaciones
        (id_servicio, servicio, en_predio, disponibilidad, distancia, relevamiento_id)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        servicio = VALUES(servicio),
        en_predio = VALUES(en_predio),
        disponibilidad = VALUES(disponibilidad),
        distancia = VALUES(distancia)
    `,
      values
    );

    return NextResponse.json({ upserted: norm.length }, { status: 200 });
  } catch (err: any) {
    console.error("PATCH stc error:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
