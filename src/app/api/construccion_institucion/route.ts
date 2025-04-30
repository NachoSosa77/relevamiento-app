/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Obtener datos del request
    const instituciones = body;

    if (!instituciones || instituciones.length === 0) {
      return NextResponse.json(
        {
          message:
            "Faltan datos para asociar la construcción con las instituciones",
        },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    // Aquí puedes recorrer las instituciones y asociarlas una por una
    for (const institucion of instituciones) {
      const { construccion_id, institucion_id } = institucion;

      await connection.query(
        `INSERT INTO construccion_institucion (construccion_id, institucion_id) VALUES (?, ?)`,
        [construccion_id, institucion_id]
      );
    }

    connection.release();
    return NextResponse.json(
      { message: "Construcción asociada a instituciones correctamente" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error al asociar construcción con instituciones:", err);
    return NextResponse.json(
      {
        message: "Error al asociar construcción con instituciones",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
