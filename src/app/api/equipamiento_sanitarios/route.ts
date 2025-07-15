import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Payload debe ser un array" },
        { status: 400 }
      );
    }

    if (data.length === 0) {
      return NextResponse.json(
        { message: "No hay datos para insertar" },
        { status: 200 }
      );
    }

    const values = data.map((item) => [
      item.equipamiento ?? null,
      item.cantidad ?? null,
      item.cantidad_funcionamiento ?? null,
      item.estado ?? null,
      item.relevamiento_id ?? null,
      item.local_id ?? null,
    ]);

    const query = `
      INSERT INTO equipamiento_sanitarios 
      (equipamiento, cantidad, cantidad_funcionamiento, estado, relevamiento_id, local_id)
      VALUES ${values.map(() => "(?, ?, ?, ?, ?, ?)").join(", ")}
    `;

    const flatValues = values.flat();

    await connection.execute(query, flatValues);

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

export async function GET(req: NextRequest) {
  const localId = Number(req.nextUrl.searchParams.get("localId"));
  const relevamientoId = Number(req.nextUrl.searchParams.get("relevamientoId"));

  if (!localId || !relevamientoId) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const connection = await getConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM equipamiento_sanitarios WHERE local_id = ? AND relevamiento_id = ?`,
    [localId, relevamientoId]
  );

  return NextResponse.json(rows);
}
