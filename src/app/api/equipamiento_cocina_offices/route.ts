import { pool } from "@/app/lib/db"; // 🔹 MODIFICACIÓN: Importamos pool
import { RowDataPacket } from "mysql2/promise";
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
    // 🔹 Eliminada la llamada a getConnection()
    const data: EquipamientoItem[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    // Creamos el array de valores para la inserción masiva
    const values = data.map((item) => [
      item.equipamiento ?? null,
      item.cantidad ?? null,
      item.cantidad_funcionamiento ?? null,
      item.estado ?? null,
      item.relevamiento_id,
      item.local_id,
    ]);

    // Query para inserción masiva (VALUES ?) con UPSERT (INSERT o UPDATE)
    const insertQuery = `
      INSERT INTO equipamiento_cocina_offices 
      (equipamiento, cantidad, cantidad_funcionamiento, estado, relevamiento_id, local_id)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        equipamiento = VALUES(equipamiento),
        cantidad = VALUES(cantidad),
        cantidad_funcionamiento = VALUES(cantidad_funcionamiento),
        estado = VALUES(estado)
    `;

    // 🔹 MODIFICACIÓN CLAVE: Usamos pool.query() para el batch insert
    await pool.query(insertQuery, [values]);

    return NextResponse.json(
      { message: "Datos insertados/actualizados correctamente" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error al insertar/actualizar los datos:", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al insertar/actualizar los datos", details },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const localId = Number(req.nextUrl.searchParams.get("localId"));
    const relevamientoId = Number(
      req.nextUrl.searchParams.get("relevamientoId")
    );

    if (!localId || !relevamientoId) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    // 🔹 MODIFICACIÓN CLAVE: Usamos pool.execute() directamente
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM equipamiento_cocina_offices WHERE local_id = ? AND relevamiento_id = ?`,
      [localId, relevamientoId]
    );

    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("Error al obtener equipamiento_cocina_offices:", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al obtener los datos", details },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    // 🔹 Eliminada la llamada a getConnection()
    const data: EquipamientoItem[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    // 🔹 MODIFICACIÓN CLAVE: Optimizamos el PUT usando Promise.all para paralelizar
    const updatePromises = data.map((item) => {
      if (!item.id) return Promise.resolve(null); // saltamos si no hay ID

      const updateQuery = `
        UPDATE equipamiento_cocina_offices
        SET equipamiento = ?, cantidad = ?, cantidad_funcionamiento = ?, estado = ?
        WHERE id = ? AND relevamiento_id = ? AND local_id = ?
      `;

      return pool.execute(updateQuery, [
        item.equipamiento ?? null,
        item.cantidad ?? null,
        item.cantidad_funcionamiento ?? null,
        item.estado ?? null,
        item.id,
        item.relevamiento_id,
        item.local_id,
      ]);
    });

    await Promise.all(updatePromises); // Esperamos a que todas las promesas se completen

    return NextResponse.json(
      { message: "Datos actualizados correctamente" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error al actualizar los datos:", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al actualizar los datos", details },
      { status: 500 }
    );
  }
}
