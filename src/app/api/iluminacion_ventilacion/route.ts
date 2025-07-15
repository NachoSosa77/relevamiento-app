import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO iluminacion_ventilacion (
        condicion, disponibilidad, superficie_iluminacion, superficie_ventilacion, relevamiento_id, local_id
      ) VALUES ?
    `;

    // Construir valores en formato [[a1, b1, ...], [a2, b2, ...]]
    const values = data.map((item) => [
      item.condicion ?? null,
      item.disponibilidad ?? null,
      item.superficie_iluminacion ?? null,
      item.superficie_ventilacion ?? null,
      item.relevamiento_id ?? null,
      item.local_id ?? null,
    ]);

    await connection.query(insertQuery, [values]);

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

export async function GET(req: NextRequest) {
  const localId = Number(req.nextUrl.searchParams.get("localId"));
  const relevamientoId = Number(req.nextUrl.searchParams.get("relevamientoId"));

  if (!localId || !relevamientoId) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const connection = await getConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM iluminacion_ventilacion WHERE local_id = ? AND relevamiento_id = ?`,
    [localId, relevamientoId]
  );

  return NextResponse.json(rows);
}
