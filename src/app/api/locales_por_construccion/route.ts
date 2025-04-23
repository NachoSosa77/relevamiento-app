/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: "Se esperaba un array de locales" },
        { status: 400 }
      );
    }

    const insertResults = [];

    for (const local of body) {
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO locales_por_construccion (
          numero_construccion,
          superficie_cubierta,
          superficie_semicubierta,
          superficie_total,
          identificacion_plano,
          numero_planta,
          tipo,
          local_sin_uso,
          superficie,
          cui_number,
          relevamiento_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          local.numero_construccion,
          local.superficie_cubierta,
          local.superficie_semicubierta,
          local.superficie_total,
          local.identificacion_plano,
          local.numero_planta,
          local.tipo,
          local.local_sin_uso,
          local.superficie,
          local.cui_number,
          local.relevamiento_id, // 👈 nuevo valor insertado
        ]
      );

      insertResults.push({ id: result.insertId, ...local });

      connection.release();
    }

    return NextResponse.json({
      message: "Local creado correctamente",
      inserted: insertResults,
    });
  } catch (err: any) {
    console.error("Error al crear el local:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
