import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Payload debe ser un array" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO energias_alternativas (tipo,  disponibilidad, relevamiento_id, construccion_id)
      VALUES (?, ?, ?, ?)
    `;

    for (const item of data) {
      const { tipo, disponibilidad, relevamiento_id, construccion_id } = item;

      await connection.execute(insertQuery, [
        tipo ?? null,
        disponibilidad ?? null,
        relevamiento_id ?? null,
        construccion_id ?? null,
      ]);
    }

    return NextResponse.json(
      { message: "Datos insertados correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al insertar los datos:", error);
    return NextResponse.json(
      { error: "Error al insertar los datos" },
      { status: 500 }
    );
  }
}
