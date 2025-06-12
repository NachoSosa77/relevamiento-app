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

    const [rows]: any = await connection.execute(
      `SELECT id FROM plantas WHERE construccion_id = ? AND relevamiento_id = ?`,
      [construccion_id, relevamiento_id]
    );

    if (rows.length > 0) {
      return NextResponse.json(
        {
          message:
            "Ya existen plantas registradas para esta construcción y relevamiento.",
          exists: true,
          planta_id: rows[0].id,
        },
        { status: 200 }
      );
    }

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

export async function PATCH(req: Request) {
  const connection = await getConnection();
  try {
    const body = await req.json();
    const { planta_id, plantas } = body;

    const { subsuelo, pb, pisos_superiores } = plantas;

    const query = `
      UPDATE plantas 
      SET subsuelo = ?, pb = ?, pisos_superiores = ?
      WHERE id = ?
    `;

    await connection.execute(query, [
      subsuelo || 0,
      pb || 0,
      pisos_superiores || 0,
      planta_id,
    ]);

    return NextResponse.json(
      {
        message: "Plantas actualizadas correctamente",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al actualizar las plantas:", error);
    return NextResponse.json(
      {
        message: "Error al actualizar las plantas",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
