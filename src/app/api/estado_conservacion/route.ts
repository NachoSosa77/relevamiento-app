import { getConnection } from "@/app/lib/db";
import { recomputeEstadoConstruccion } from "@/app/lib/recompute-estado"; // 👈 importa el helper
import type { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

// GET: Obtener datos por relevamiento_id y construccion_id
export async function GET(req: NextRequest) {
  const relevamiento_id = req.nextUrl.searchParams.get("relevamiento_id");
  const construccion_id = req.nextUrl.searchParams.get("construccion_id");

  if (!relevamiento_id || !construccion_id) {
    return NextResponse.json(
      { error: "Faltan parámetros requeridos" },
      { status: 400 }
    );
  }

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT * FROM estado_conservacion WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error en GET estado_conservacion:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST: Insertar nuevo registro (array)
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

    for (const item of data) {
      const {
        relevamiento_id,
        construccion_id,
        estructura,
        disponibilidad,
        estado,
        tipo,
        sub_tipo, // 👈 si más adelante lo usas, ya está previsto
      } = item;

      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as count 
         FROM estado_conservacion 
         WHERE relevamiento_id = ? AND construccion_id = ? AND estructura = ?`,
        [relevamiento_id, construccion_id, estructura]
      );

      const count = (rows[0] as { count: number }).count;

      if (count > 0) {
        connection.release();
        return NextResponse.json(
          {
            error:
              "Ya existe un registro para este relevamiento y construcción",
          },
          { status: 409 }
        );
      }

      await connection.execute(
        `INSERT INTO estado_conservacion (estructura, disponibilidad, estado, relevamiento_id, construccion_id, tipo, sub_tipo)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          estructura ?? null,
          disponibilidad ?? null,
          estado ?? null,
          relevamiento_id,
          construccion_id,
          tipo ?? null,
          sub_tipo ?? null,
        ]
      );
    }

    // 🔹 Nuevo paso: recalcular snapshot del estado general
    const relId = Number(data[0].relevamiento_id);
    const constId = Number(data[0].construccion_id);
    await recomputeEstadoConstruccion(relId, constId);

    connection.release();
    return NextResponse.json(
      { message: "Datos insertados y snapshot actualizado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST estado_conservacion:", error);
    return NextResponse.json(
      { error: "Error al insertar los datos" },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar registros existentes
export async function PATCH(req: Request) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Payload debe ser un array" },
        { status: 400 }
      );
    }

    for (const item of data) {
      const {
        estructura,
        disponibilidad,
        estado,
        relevamiento_id,
        construccion_id,
        tipo,
        sub_tipo,
      } = item;

      await connection.execute(
        `UPDATE estado_conservacion 
         SET disponibilidad = ?, estado = ?, tipo = ?, sub_tipo = ?
         WHERE relevamiento_id = ? AND construccion_id = ? AND estructura = ?`,
        [
          disponibilidad ?? null,
          estado ?? null,
          tipo ?? null,
          sub_tipo ?? null,
          relevamiento_id,
          construccion_id,
          estructura,
        ]
      );
    }

    // 🔹 Nuevo paso: recalcular snapshot después del update
    const relId = Number(data[0].relevamiento_id);
    const constId = Number(data[0].construccion_id);
    await recomputeEstadoConstruccion(relId, constId);

    connection.release();
    return NextResponse.json(
      { message: "Datos actualizados y snapshot recalculado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH estado_conservacion:", error);
    return NextResponse.json(
      { error: "Error al actualizar los datos" },
      { status: 500 }
    );
  }
}
