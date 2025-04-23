/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const connection = await getConnection();
  const body = await req.json();

  const { relevamiento_id, instituciones } = body;

  if (
    !relevamiento_id ||
    !Array.isArray(instituciones) ||
    instituciones.length === 0
  ) {
    return NextResponse.json(
      { message: "Datos faltantes o incorrectos" },
      { status: 400 }
    );
  }

  try {
    for (const institucion_id of instituciones) {
      await connection.query(
        `INSERT INTO instituciones_por_relevamiento (
          relevamiento_id,
          institucion_id
        ) VALUES (?, ?)`,
        [relevamiento_id, institucion_id]
      );
    }

    connection.release();

    return NextResponse.json({
      message: "Instituciones relacionadas correctamente con el relevamiento",
    });
  } catch (error: any) {
    console.error("Error al relacionar instituciones:", error);
    connection.release();
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
