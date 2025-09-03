import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

interface EquipamientoSanitario {
  id?: number;
  equipamiento: string;
  cantidad: number;
  cantidad_funcionamiento: number;
  estado: string;
  relevamiento_id: number;
  local_id: number;
}

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data: EquipamientoSanitario[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
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
    await connection.execute(query, flatValues); // ✅ Aquí no necesitamos tipar con EquipamientoSanitario[]

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

export async function PUT(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data: EquipamientoSanitario[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    for (const item of data) {
      if (!item.id) continue; // saltamos si no tiene ID

      const query = `
        UPDATE equipamiento_sanitarios
        SET equipamiento = ?, cantidad = ?, cantidad_funcionamiento = ?, estado = ?
        WHERE id = ? AND relevamiento_id = ? AND local_id = ?
      `;

      await connection.execute(query, [
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

export async function GET(req: NextRequest) {
  const localId = Number(req.nextUrl.searchParams.get("localId"));
  const relevamientoId = Number(req.nextUrl.searchParams.get("relevamientoId"));

  if (!localId || !relevamientoId) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const connection = await getConnection();

  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT * FROM equipamiento_sanitarios WHERE local_id = ? AND relevamiento_id = ?`,
    [localId, relevamientoId]
  );

  return NextResponse.json(rows as EquipamientoSanitario[]);
}
