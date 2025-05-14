/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      relevamiento_id,
      numero_construccion,
      superficie_cubierta,
      superficie_semicubierta,
      superficie_total,
      antiguedad,
      destino,
    } = body;

    // Validación básica
    if (
      relevamiento_id === undefined ||
      numero_construccion === undefined ||
      superficie_cubierta === undefined ||
      superficie_semicubierta === undefined ||
      superficie_total === undefined ||
      !antiguedad ||
      !destino
    ) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO construcciones (
        relevamiento_id,
        numero_construccion,
        superficie_cubierta,
        superficie_semicubierta,
        superficie_total,
        antiguedad,
        destino
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        relevamiento_id,
        numero_construccion,
        superficie_cubierta,
        superficie_semicubierta,
        superficie_total,
        antiguedad,
        destino,
      ]
    );

    connection.release();

    return NextResponse.json(
      {
        message: "Construcción creada correctamente",
        construccion_id: result.insertId,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error al insertar los datos de la construcción:", err);
    return NextResponse.json(
      {
        message: "Error al insertar los datos de la construcción",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
