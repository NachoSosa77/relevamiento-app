/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const connection = await getConnection();
  const body = await req.json();

  const { relevamiento_id, instituciones } = body;

  if (!relevamiento_id || !Array.isArray(instituciones)) {
    return NextResponse.json(
      { message: "Datos faltantes o incorrectos" },
      { status: 400 }
    );
  }

  try {
    await connection.beginTransaction();

    // Obtener instituciones actuales en BD para el relevamiento
    const [rows]: any = await connection.query(
      `SELECT institucion_id FROM instituciones_por_relevamiento WHERE relevamiento_id = ?`,
      [relevamiento_id]
    );
    const actuales = rows.map((r: any) => r.institucion_id);

    // Instituciones a insertar (las nuevas)
    const aInsertar = instituciones.filter(
      (id: number) => !actuales.includes(id)
    );

    // Instituciones a eliminar (ya no están en el array enviado)
    const aEliminar = actuales.filter(
      (id: number) => !instituciones.includes(id)
    );

    // Insertar nuevas relaciones
    for (const institucion_id of aInsertar) {
      await connection.query(
        `INSERT INTO instituciones_por_relevamiento (relevamiento_id, institucion_id) VALUES (?, ?)`,
        [relevamiento_id, institucion_id]
      );
    }

    // Eliminar relaciones removidas
    if (aEliminar.length > 0) {
      await connection.query(
        `DELETE FROM instituciones_por_relevamiento WHERE relevamiento_id = ? AND institucion_id IN (?)`,
        [relevamiento_id, aEliminar]
      );
    }

    await connection.commit();
    connection.release();

    return NextResponse.json({
      message: "Relaciones actualizadas correctamente",
    });
  } catch (error: any) {
    await connection.rollback();
    connection.release();
    console.error("Error al actualizar relaciones:", error);
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
