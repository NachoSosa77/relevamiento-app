/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection, pool } from "@/app/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET
 * ?relevamiento_id=XXX&construccion_id=YYY
 * Devuelve las filas existentes para esa pareja (relevamiento, construcción)
 */
export async function GET(req: NextRequest) {
  const relevamiento_id = req.nextUrl.searchParams.get("relevamiento_id");
  const construccion_id = req.nextUrl.searchParams.get("construccion_id");

  if (!relevamiento_id || !construccion_id) {
    return NextResponse.json(
      { error: "Faltan parámetros relevamiento_id o construccion_id" },
      { status: 400 }
    );
  }

  let connection: any;
  try {
    connection = await getConnection();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, tipo, disponibilidad, relevamiento_id, construccion_id
       FROM energias_alternativas
       WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error en GET energias_alternativas:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection?.release?.();
  }
}

/**
 * POST
 * Body: Array<{ tipo, disponibilidad, relevamiento_id, construccion_id }>
 * Inserta en bloque solo si NO existe ningún registro previo para esa pareja (relevamiento, construcción).
 * Si ya existe, responde 409 para que el frontend reintente con PATCH.
 */
export async function POST(req: Request) {
  let connection: any;
  try {
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array con al menos un elemento" },
        { status: 400 }
      );
    }

    const { relevamiento_id, construccion_id } = data[0] ?? {};
    if (!relevamiento_id || !construccion_id) {
      return NextResponse.json(
        { error: "Faltan relevamiento_id o construccion_id en el payload" },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // ¿Ya existen filas para esa pareja?
    const [countRows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS count
         FROM energias_alternativas
        WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );
    const exists = Number((countRows as any)[0]?.count ?? 0) > 0;
    if (exists) {
      return NextResponse.json(
        { error: "Ya existen datos para este relevamiento y construcción" },
        { status: 409 }
      );
    }

    await connection.beginTransaction();

    const insertSql = `
      INSERT INTO energias_alternativas (tipo, disponibilidad, relevamiento_id, construccion_id)
      VALUES (?, ?, ?, ?)
    `;

    for (const item of data) {
      const { tipo, disponibilidad } = item;
      await pool.execute<ResultSetHeader>(insertSql, [
        tipo ?? null,
        disponibilidad ?? null,
        relevamiento_id,
        construccion_id,
      ]);
    }

    await connection.commit();
    return NextResponse.json({ message: "Datos insertados correctamente" });
  } catch (error) {
    console.error("Error en POST energias_alternativas:", error);
    await connection?.rollback?.();
    return NextResponse.json(
      { error: "Error al insertar los datos" },
      { status: 500 }
    );
  } finally {
    connection?.release?.();
  }
}

/**
 * PATCH
 * Body: Array<{ tipo, disponibilidad, relevamiento_id, construccion_id }>
 * Para cada item:
 *   - intenta UPDATE por (relevamiento_id, construccion_id, tipo)
 *   - si no afectó filas → hace INSERT (upsert manual)
 */
export async function PATCH(req: Request) {
  let connection: any;
  try {
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array con al menos un elemento" },
        { status: 400 }
      );
    }

    const { relevamiento_id, construccion_id } = data[0] ?? {};
    if (!relevamiento_id || !construccion_id) {
      return NextResponse.json(
        { error: "Faltan relevamiento_id o construccion_id en el payload" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    const updateSql = `
      UPDATE energias_alternativas
         SET disponibilidad = ?
       WHERE relevamiento_id = ? AND construccion_id = ? AND tipo = ?
    `;

    const insertSql = `
      INSERT INTO energias_alternativas (tipo, disponibilidad, relevamiento_id, construccion_id)
      VALUES (?, ?, ?, ?)
    `;

    for (const item of data) {
      const { tipo, disponibilidad } = item;

      const [result] = await pool.execute<ResultSetHeader>(updateSql, [
        disponibilidad ?? null,
        relevamiento_id,
        construccion_id,
        tipo ?? null,
      ]);

      if ((result as any).affectedRows === 0) {
        await pool.execute<ResultSetHeader>(insertSql, [
          tipo ?? null,
          disponibilidad ?? null,
          relevamiento_id,
          construccion_id,
        ]);
      }
    }

    await connection.commit();
    return NextResponse.json({
      message: "Datos actualizados correctamente (upsert)",
    });
  } catch (error) {
    console.error("Error en PATCH energias_alternativas:", error);
    await connection?.rollback?.();
    return NextResponse.json(
      { error: "Error al actualizar los datos" },
      { status: 500 }
    );
  } finally {
    connection?.release?.();
  }
}
