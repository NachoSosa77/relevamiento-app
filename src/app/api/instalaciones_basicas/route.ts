import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
      INSERT INTO instalaciones_basicas (servicio, tipo_instalacion, funciona, motivo, relevamiento_id, local_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const item of data) {
      const {
        servicio,
        tipo_instalacion,
        funciona,
        motivo,
        relevamiento_id,
        local_id,
      } = item;

      await connection.execute(insertQuery, [
        servicio ?? null,
        tipo_instalacion ?? null,
        funciona ?? null,
        motivo ?? null,
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

export async function GET(req: NextRequest) {
  const localId = Number(req.nextUrl.searchParams.get("localId"));
  const relevamientoId = Number(req.nextUrl.searchParams.get("relevamientoId"));

  if (!localId || !relevamientoId) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const connection = await getConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM instalaciones_basicas WHERE local_id = ? AND relevamiento_id = ?`,
    [localId, relevamientoId]
  );

  return NextResponse.json(rows);
}
