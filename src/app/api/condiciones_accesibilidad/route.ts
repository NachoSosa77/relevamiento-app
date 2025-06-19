import { getConnection } from "@/app/lib/db";
import type { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const connection = await getConnection();

  try {
    const body = await req.json();

    const { relevamiento_id, servicios, construccion_id } = body;

    if (!Array.isArray(servicios) || servicios.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron servicios" },
        { status: 400 }
      );
    }

    for (const item of servicios) {
      const { servicio, disponibilidad, estado, mantenimiento, cantidad } =
        item;

      await connection.query<ResultSetHeader>(
        `INSERT INTO condiciones_accesibilidad (
          servicio,
          disponibilidad,
          estado,
          mantenimiento,
          cantidad,      
          relevamiento_id,
          construccion_id
        ) VALUES (?, ?, ?, ?, ?,?,?)`,
        [
          servicio,
          disponibilidad,
          estado,
          mantenimiento,
          cantidad,
          relevamiento_id,
          construccion_id,
        ]
      );
    }

    return NextResponse.json({
      message: "Relevamiento condiciones accesibilidad guardados correctamente",
    });
  } catch (error) {
    console.error("Error al guardar relevamiento:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}
