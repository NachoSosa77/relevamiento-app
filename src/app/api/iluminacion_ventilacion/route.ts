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
      INSERT INTO iluminacion_ventilacion (condicion, disponibilidad, superficie_iluminacion, superficie_ventilacion, relevamiento_id, local_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const item of data) {
      const {
        condicion,
        disponibilidad,
        superficie_iluminacion,
        superficie_ventilacion,
        relevamiento_id,
        local_id,
      } = item;

      await connection.execute(insertQuery, [
        condicion ?? null,
        disponibilidad ?? null,
        superficie_iluminacion ?? null,
        superficie_ventilacion ?? null,
        relevamiento_id ?? null,
        local_id ?? null,
      ]);
    }

    return NextResponse.json(
      { message: "Datos insertados correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al insertar aberturas:", error);
    return NextResponse.json(
      { error: "Error al insertar los datos" },
      { status: 500 }
    );
  }
}
