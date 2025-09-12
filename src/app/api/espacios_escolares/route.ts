/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const connection = await getConnection();
  const body = await req.json();

  const {
    relevamiento_id,
    cui,
    cantidadConstrucciones,
    superficieTotalPredio,
    observaciones,
    areasExteriores,
  } = body;

  try {
    // 🔹 Obtener predio_id relacionado
    const [predioRows]: any = await connection.query(
      `SELECT id FROM predio WHERE relevamiento_id = ? LIMIT 1`,
      [relevamiento_id]
    );
    const predio_id = predioRows.length ? predioRows[0].id : null;

    // 🔹 Verificar si ya existe un espacio escolar
    const [espacioRows]: any = await connection.query(
      `SELECT id FROM espacios_escolares WHERE relevamiento_id = ? AND cui = ?`,
      [relevamiento_id, cui]
    );

    let espacioEscolarId: number;
    if (espacioRows.length > 0) {
      // 🔹 Actualizar registro existente
      espacioEscolarId = espacioRows[0].id;
      await connection.query(
        `UPDATE espacios_escolares
         SET cantidad_construcciones = ?,
             superficie_total_predio = ?,
             observaciones = ?,
             predio_id = ?
         WHERE id = ?`,
        [
          cantidadConstrucciones,
          superficieTotalPredio,
          observaciones,
          predio_id,
          espacioEscolarId,
        ]
      );
    } else {
      // 🔹 Insertar nuevo registro
      const [insertResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO espacios_escolares (
           cantidad_construcciones,
           superficie_total_predio,
           observaciones,
           cui,
           relevamiento_id,
           predio_id
         ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          cantidadConstrucciones,
          superficieTotalPredio,
          observaciones,
          cui,
          relevamiento_id,
          predio_id,
        ]
      );
      espacioEscolarId = insertResult.insertId;
    }

    // 🔹 Actualizar áreas exteriores para este relevamiento y cui
    if (Array.isArray(areasExteriores)) {
      for (const areaId of areasExteriores) {
        await connection.query(
          `UPDATE areas_exteriores
           SET relevamiento_id = ?, cui_number = ?
           WHERE id = ?`,
          [relevamiento_id, cui, areaId]
        );
      }
    }

    connection.release();

    return NextResponse.json({
      message: "Espacio escolar guardado o actualizado correctamente",
    });
  } catch (error: any) {
    console.error("Error al crear/actualizar el espacio escolar:", error);
    connection.release();
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
