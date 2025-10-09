import { pool } from "@/app/lib/db";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  try {
    const { relevamientoId } = await params;
    const relId = Number(relevamientoId);
    if (!relId) {
      return NextResponse.json(
        { message: "relevamientoId inválido" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `SELECT id, id_servicio, riesgo, respuesta, mitigacion, descripcion, descripcion_otro,
              relevamiento_id, created_at, updated_at
         FROM factores_riesgo_ambiental
        WHERE relevamiento_id = ?
        ORDER BY id_servicio`,
      [relId]
    );

    // @ts-ignore
    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ servicios: rows }, { status: 200 });
  } catch (err: any) {
    console.error("GET factores_riesgo error:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

type FactorItem = {
  id_servicio: string; // clave de catálogo
  riesgo?: string | null;
  respuesta?: string | null;
  mitigacion?: string | null;
  descripcion?: string | null;
  descripcion_otro?: string | null; // asegura que coincida con el nombre en la DB
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  try {
    const { relevamientoId } = await params;
    const relId = Number(relevamientoId);
    if (!relId) {
      return NextResponse.json(
        { message: "relevamientoId inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const factores: FactorItem[] = body?.factores;
    if (!Array.isArray(factores) || factores.length === 0) {
      return NextResponse.json(
        { message: "Se espera { factores: FactorItem[] } no vacío" },
        { status: 400 }
      );
    }

    for (const f of factores) {
      if (!f?.id_servicio) {
        return NextResponse.json(
          { message: "Cada item requiere id_servicio" },
          { status: 400 }
        );
      }
    }

    // Armado de UPSERT
    const placeholders = factores.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");
    const values: any[] = [];
    for (const f of factores) {
      values.push(
        f.id_servicio,
        f.riesgo ?? null,
        f.respuesta ?? null,
        f.mitigacion ?? null,
        f.descripcion ?? null,
        f.descripcion_otro ?? null,
        relId
      );
    }

    await pool.query(
      `
      INSERT INTO factores_riesgo_ambiental
        (id_servicio, riesgo, respuesta, mitigacion, descripcion, descripcion_otro, relevamiento_id)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        riesgo = VALUES(riesgo),
        respuesta = VALUES(respuesta),
        mitigacion = VALUES(mitigacion),
        descripcion = VALUES(descripcion),
        descripcion_otro = VALUES(descripcion_otro)
    `,
      values
    );

    return NextResponse.json({ upserted: factores.length }, { status: 200 });
  } catch (err: any) {
    console.error("PATCH factores_riesgo error:", err);
    // Si falta el UNIQUE, ON DUPLICATE KEY no se dispara (recomendado agregarlo).
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
