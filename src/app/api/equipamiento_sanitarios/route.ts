import { pool } from "@/app/lib/db"; // 🔹 MODIFICACIÓN: Importamos pool
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
    // 🔹 Se eliminó: const connection = await getConnection();
    const data: EquipamientoSanitario[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { message: "No hay datos para insertar" },
        { status: 200 }
      );
    }

    // Usamos batch insert con placeholders de valores
    const values = data.map((item) => [
      item.equipamiento ?? null,
      item.cantidad ?? null,
      item.cantidad_funcionamiento ?? null,
      item.estado ?? null,
      // Nota: asumimos que relevamiento_id y local_id siempre vienen en el payload
      // Si son obligatorios, puedes omitir el '?? null' aquí si son 'number'
      item.relevamiento_id,
      item.local_id,
    ]);

    // Usamos el placeholder multi-row '?' y VALUES(columna) para el UPSERT
    const insertQuery = `
      INSERT INTO equipamiento_sanitarios 
      (equipamiento, cantidad, cantidad_funcionamiento, estado, relevamiento_id, local_id)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        equipamiento = VALUES(equipamiento),
        cantidad = VALUES(cantidad),
        cantidad_funcionamiento = VALUES(cantidad_funcionamiento),
        estado = VALUES(estado)
    `;

    // 🔹 MODIFICACIÓN CLAVE: Usamos pool.query() para el batch insert (placeholder '?')
    // También se recomienda usar 'ON DUPLICATE KEY UPDATE' en un POST para evitar errores si la data se envía varias veces.
    await pool.query(insertQuery, [values]);

    return NextResponse.json(
      { message: "Datos insertados/actualizados correctamente" }, // Mensaje actualizado por el UPSERT
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

export async function PUT(req: NextRequest) {
  try {
    // 🔹 Se eliminó: const connection = await getConnection();
    const data: EquipamientoSanitario[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    // Optimizamos el PUT usando Promise.all para ejecutar las actualizaciones en paralelo
    const updatePromises = data.map((item) => {
      if (!item.id) return Promise.resolve(null);

      const query = `
        UPDATE equipamiento_sanitarios
        SET equipamiento = ?, cantidad = ?, cantidad_funcionamiento = ?, estado = ?
        WHERE id = ? AND relevamiento_id = ? AND local_id = ?
      `;

      // 🔹 MODIFICACIÓN CLAVE: Usamos pool.execute() para cada actualización
      return pool.execute(query, [
        item.equipamiento ?? null,
        item.cantidad ?? null,
        item.cantidad_funcionamiento ?? null,
        item.estado ?? null,
        item.id,
        item.relevamiento_id,
        item.local_id,
      ]);
    });

    await Promise.all(updatePromises);

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
      `SELECT * FROM equipamiento_sanitarios WHERE local_id = ? AND relevamiento_id = ?`,
      [localId, relevamientoId]
    );

    return NextResponse.json(rows as EquipamientoSanitario[]);
  } catch (error: unknown) {
    console.error("Error al obtener equipamiento_sanitarios:", error);
    const details = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: "Error al obtener los datos", details },
      { status: 500 }
    );
  }
}
