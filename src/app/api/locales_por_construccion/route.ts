/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import type { ResultSetHeader } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let connection: PoolConnection | undefined;

  try {
    connection = await getConnection();
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: "Se esperaba un array de locales" },
        { status: 400 }
      );
    }

    const insertResults: any[] = [];
    const updateResults: any[] = [];

    // ✅ Sugerido: transacción
    await connection.beginTransaction();

    // helper: valida que exista el local_id en opciones_locales
    const ensureLocalId = async (val: any): Promise<number | null> => {
      const n = val != null ? Number(val) : NaN;
      if (Number.isNaN(n)) return null;
      const [rows] = await connection!.execute(
        "SELECT id FROM opciones_locales WHERE id = ? LIMIT 1",
        [n]
      );
      const ok = Array.isArray(rows) && (rows as any[])[0]?.id != null;
      return ok ? n : null;
    };

    for (const local of body) {
      const localIdNum = await ensureLocalId(local.local_id);
      if (localIdNum == null) {
        await connection.rollback();
        return NextResponse.json(
          { message: `local_id inválido: ${local.local_id}` },
          { status: 400 }
        );
      }

      if (local.id) {
        // 🔧 UPDATE existente: tipo siempre = name (opciones_locales)
        const [res] = await connection.execute<ResultSetHeader>(
          `
          UPDATE locales_por_construccion
          SET 
            construccion_id      = ?,
            identificacion_plano = ?,
            numero_planta        = ?,
            tipo                 = (SELECT name FROM opciones_locales WHERE id = ?),
            tipo_superficie      = ?,
            local_id             = ?,
            local_sin_uso        = ?,
            superficie           = ?,
            relevamiento_id      = ?,
            cui_number           = ?,
            numero_construccion  = ?
          WHERE id = ?
          `,
          [
            local.construccion_id ?? null,
            local.identificacion_plano ?? null,
            local.numero_planta ?? null,
            localIdNum, // para SELECT name
            local.tipo_superficie ?? null,
            localIdNum,
            local.local_sin_uso ?? null,
            local.superficie ?? null,
            local.relevamiento_id ?? null,
            local.cui_number ?? null,
            local.numero_construccion ?? null,
            local.id, // WHERE
          ]
        );
        updateResults.push({ id: local.id, affectedRows: res.affectedRows });
      } else {
        // 🆕 INSERT: tipo = name (opciones_locales)
        const [res] = await connection.execute<ResultSetHeader>(
          `
          INSERT INTO locales_por_construccion (
            construccion_id,
            identificacion_plano,
            numero_planta,
            tipo,                -- <- name de opciones_locales
            tipo_superficie,
            local_id,
            local_sin_uso,
            superficie,
            relevamiento_id,
            cui_number,
            numero_construccion
          )
          SELECT
            ?, ?, ?, name, ?, ?, ?, ?, ?, ?, ?
          FROM opciones_locales
          WHERE id = ?
          `,
          [
            local.construccion_id ?? null,
            local.identificacion_plano ?? null,
            local.numero_planta ?? null,
            local.tipo_superficie ?? null,
            localIdNum,
            local.local_sin_uso ?? null,
            local.superficie ?? null,
            local.relevamiento_id ?? null,
            local.cui_number ?? null,
            local.numero_construccion ?? null,
            localIdNum, // WHERE id = ?
          ]
        );

        if (res.affectedRows === 0) {
          await connection.rollback();
          return NextResponse.json(
            {
              message: `No se pudo insertar: local_id inválido (${local.local_id})`,
            },
            { status: 400 }
          );
        }

        insertResults.push({ id: res.insertId, ...local });
      }
    }

    await connection.commit();

    return NextResponse.json({
      message: "Operación realizada",
      inserted: insertResults,
      updated: updateResults,
    });
  } catch (err: any) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {}
    }
    console.error("Error al crear/actualizar locales:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch {}
    }
  }
}
