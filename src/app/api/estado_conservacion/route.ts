// /app/api/estado_conservacion/route.ts
import { pool } from "@/app/lib/db";
import { recomputeEstadoConstruccion } from "@/app/lib/recompute-estado";
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
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * 
       FROM estado_conservacion 
       WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error en GET estado_conservacion:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST: Insertar o actualizar (upsert) en base a id
export async function POST(req: NextRequest) {
  const conn = await pool.getConnection();
  try {
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    for (const item of data) {
      const {
        id,
        relevamiento_id,
        construccion_id,
        estructura,
        disponibilidad,
        estado,
        tipo,
        sub_tipo,
      } = item;

      if (!relevamiento_id || !construccion_id) {
        throw new Error(
          "Cada item debe incluir relevamiento_id y construccion_id"
        );
      }

      if (id) {
        // 🔁 UPDATE por id
        await conn.execute(
          `UPDATE estado_conservacion 
           SET estructura = ?, disponibilidad = ?, estado = ?, tipo = ?, sub_tipo = ?
           WHERE id = ?`,
          [
            estructura ?? null,
            disponibilidad ?? null,
            estado ?? null,
            tipo ?? null,
            sub_tipo ?? null,
            id,
          ]
        );
      } else {
        // ➕ INSERT si no hay id
        await conn.execute(
          `INSERT INTO estado_conservacion 
            (estructura, disponibilidad, estado, relevamiento_id, construccion_id, tipo, sub_tipo)
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
    }

    // Tomamos el par (rel, const) del primer elemento (todos deberían compartirlo)
    const relId = Number(data[0].relevamiento_id);
    const constId = Number(data[0].construccion_id);

    await conn.commit();

    // 🔄 Recalcular snapshot una vez por request
    await recomputeEstadoConstruccion(relId, constId);

    return NextResponse.json(
      { message: "Datos guardados y snapshot actualizado correctamente" },
      { status: 200 }
    );
  } catch (error: any) {
    await conn.rollback();
    console.error("Error en POST estado_conservacion:", error);
    return NextResponse.json(
      {
        error: "Error al insertar/actualizar los datos",
        detail: error?.message,
      },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}

// PATCH: Actualizar registros existentes (misma lógica que POST, semánticamente "update")
export async function PATCH(req: NextRequest) {
  const conn = await pool.getConnection();
  try {
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    for (const item of data) {
      const {
        id,
        estructura,
        disponibilidad,
        estado,
        relevamiento_id,
        construccion_id,
        tipo,
        sub_tipo,
      } = item;

      if (!relevamiento_id || !construccion_id) {
        throw new Error(
          "Cada item debe incluir relevamiento_id y construccion_id"
        );
      }

      if (id) {
        await conn.execute(
          `UPDATE estado_conservacion 
           SET estructura = ?, disponibilidad = ?, estado = ?, tipo = ?, sub_tipo = ?
           WHERE id = ?`,
          [
            estructura ?? null,
            disponibilidad ?? null,
            estado ?? null,
            tipo ?? null,
            sub_tipo ?? null,
            id,
          ]
        );
      } else {
        await conn.execute(
          `INSERT INTO estado_conservacion 
            (estructura, disponibilidad, estado, relevamiento_id, construccion_id, tipo, sub_tipo)
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
    }

    const relId = Number(data[0].relevamiento_id);
    const constId = Number(data[0].construccion_id);

    await conn.commit();

    // 🔄 Recalcular snapshot una vez por request
    await recomputeEstadoConstruccion(relId, constId);

    return NextResponse.json(
      { message: "Datos actualizados y snapshot recalculado correctamente" },
      { status: 200 }
    );
  } catch (error: any) {
    await conn.rollback();
    console.error("Error en PATCH estado_conservacion:", error);
    return NextResponse.json(
      { error: "Error al actualizar los datos", detail: error?.message },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
