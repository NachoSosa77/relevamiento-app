/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const connection = await getConnection();
  try {
    const body = await req.json();
    const { plantas, construccion_id, relevamiento_id } = body;

    // Verificar si plantas es un objeto válido
    if (typeof plantas !== "object" || plantas === null) {
      throw new Error("plantas no es un objeto válido");
    }

    const { subsuelo, pb, pisos_superiores } = plantas;

    // Consulta para insertar los datos incluyendo relevamiento_id
    const query = `
      INSERT INTO plantas (construccion_id, relevamiento_id, subsuelo, pb, pisos_superiores) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      construccion_id,
      relevamiento_id,
      subsuelo || 0,
      pb || 0,
      pisos_superiores || 0,
    ]);

    return NextResponse.json(
      {
        message: "Plantas asociadas correctamente",
        id: (result as any).insertId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al asociar las plantas:", error);
    return NextResponse.json(
      {
        message: "Error al asociar las plantas:",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
