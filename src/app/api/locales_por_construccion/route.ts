/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const body = await req.json();

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO locales_por_construccion (numero_construccion, superficie_cubierta, superficie_semicubierta, superficie_total, identificacion_plano, numero_planta, tipo_local_id, local_sin_uso, superficie) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.numero_construccion,
        body.superficie_cubierta,
        body.superficie_semicubierta,
        body.superficie_total,
        body.identificacion_plano,
        body.numero_planta,
        body.tipo_local_id,
        body.local_sin_uso,
        body.superficie,
      ]
    );

    const localId = result.insertId;

    connection.release();

    return NextResponse.json({
      message: "Local creado correctamente",
      id: localId,
    });
  } catch (err: any) {
    console.error("Error al crear el local:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
