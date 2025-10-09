/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Item = {
  id_servicio: string;
  servicio: string;
  en_predio?: string | null;
  disponibilidad?: string | null;
  distancia?: string | null;
  relevamiento_id: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { message: "Se espera un array no vacío" },
        { status: 400 }
      );
    }

    const placeholders = body.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    const values: any[] = [];
    for (const it of body as Item[]) {
      if (!it?.relevamiento_id || !it?.id_servicio || !it?.servicio) {
        return NextResponse.json(
          { message: "Faltan campos (relevamiento_id, id_servicio, servicio)" },
          { status: 400 }
        );
      }
      values.push(
        it.id_servicio,
        it.servicio,
        it.en_predio ?? null,
        // normalización rápida
        it.disponibilidad == null
          ? null
          : ["sí", "si", "s", "Si", "Sí"].includes(
              String(it.disponibilidad).trim()
            )
          ? "Si"
          : ["no", "n", "No"].includes(String(it.disponibilidad).trim())
          ? "No"
          : String(it.disponibilidad).trim(),
        it.distancia ?? null,
        it.relevamiento_id
      );
    }

    const [res]: any = await pool.query(
      `
      INSERT INTO servicios_transporte_comunicaciones
        (id_servicio, servicio, en_predio, disponibilidad, distancia, relevamiento_id)
      VALUES ${placeholders}
    `,
      values
    );

    return NextResponse.json({ inserted: res.affectedRows }, { status: 200 });
  } catch (err: any) {
    console.error("POST stc error:", err);
    // Si agregaste el UNIQUE, ER_DUP_ENTRY indica que ya existía algún (relevamiento_id,id_servicio)
    if (err?.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ message: "already_exists" }, { status: 409 });
    }
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
