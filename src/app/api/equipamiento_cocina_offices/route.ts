import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface EquipamientoItem {
  id?: number; // para PUT
  equipamiento?: string;
  cantidad?: number;
  cantidad_funcionamiento?: number;
  estado?: string;
  relevamiento_id: number;
  local_id: number;
}

export async function POST(req: Request) {
  try {
    const connection = await getConnection();
    const data: EquipamientoItem[] = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Payload debe ser un array" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO equipamiento_cocina_offices 
      (equipamiento, cantidad, cantidad_funcionamiento, estado, relevamiento_id, local_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const item of data) {
      await connection.execute(insertQuery, [
        item.equipamiento ?? null,
        item.cantidad ?? null,
        item.cantidad_funcionamiento ?? null,
        item.estado ?? null,
        item.relevamiento_id,
        item.local_id,
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

export async function GET(req: NextRequest) {
  const localId = Number(req.nextUrl.searchParams.get("localId"));
  const relevamientoId = Number(req.nextUrl.searchParams.get("relevamientoId"));

  if (!localId || !relevamientoId) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const connection = await getConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM equipamiento_cocina_offices WHERE local_id = ? AND relevamiento_id = ?`,
    [localId, relevamientoId]
  );

  return NextResponse.json(rows);
}

export async function PUT(req: Request) {
  try {
    const connection = await getConnection();
    const data: EquipamientoItem[] = await req.json(); // 🔹 leer solo una vez

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    // 🔹 Actualizamos cada registro
    for (const item of data) {
      if (!item.id) continue; // saltamos si no hay ID

      const updateQuery = `
        UPDATE equipamiento_cocina_offices
        SET equipamiento = ?, cantidad = ?, cantidad_funcionamiento = ?, estado = ?
        WHERE id = ? AND relevamiento_id = ? AND local_id = ?
      `;

      await connection.execute(updateQuery, [
        item.equipamiento ?? null,
        item.cantidad ?? null,
        item.cantidad_funcionamiento ?? null,
        item.estado ?? null,
        item.id,
        item.relevamiento_id,
        item.local_id,
      ]);
    }

    return NextResponse.json(
      { message: "Datos actualizados correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar los datos:", error);
    return NextResponse.json(
      { error: "Error al actualizar los datos" },
      { status: 500 }
    );
  }
}
