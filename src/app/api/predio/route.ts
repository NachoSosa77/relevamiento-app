/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const connection = await getConnection();
  try {
    const body = await req.json();
    const { relevamiento_id, situacion, otra_situacion, situacion_juicio } =
      body;

    if (!relevamiento_id) {
      return NextResponse.json(
        { message: "El relevamiento_id es obligatorio" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO predio (relevamiento_id, situacion, otra_situacion, situacion_juicio)
      VALUES (?, ?, ?, ?)
    `;

    // 👇 Capturar el resultado de la inserción
    const [result]: any = await connection.execute(query, [
      relevamiento_id,
      situacion || "",
      otra_situacion || "",
      situacion_juicio || "",
    ]);

    const insertId = result.insertId; // 👈 Obtener el ID generado

    return NextResponse.json(
      {
        message: "Datos guardados correctamente en predio",
        predioId: insertId, // 👈 Devolver el ID al frontend
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error guardando datos en predio:", error);
    return NextResponse.json(
      {
        message: "Error guardando datos en predio",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
