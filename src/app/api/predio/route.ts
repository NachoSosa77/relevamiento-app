/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
    const [result]: any = await pool.execute(query, [
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const relevamiento_id = searchParams.get("relevamiento_id");

  if (!relevamiento_id) {
    return NextResponse.json(
      { message: "El parámetro relevamiento_id es obligatorio" },
      { status: 400 }
    );
  }

  try {
    const [rows]: any = await pool.execute(
      `SELECT id, relevamiento_id, situacion, otra_situacion, situacion_juicio, observaciones, created_at, updated_at
       FROM predio
       WHERE relevamiento_id = ? LIMIT 1`,
      [relevamiento_id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "not_found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error: any) {
    console.error("Error buscando predio:", error);
    return NextResponse.json(
      { message: "Error buscando predio", error: error.message },
      { status: 500 }
    );
  }
}
