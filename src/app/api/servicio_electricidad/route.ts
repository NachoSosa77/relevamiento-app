import { getConnection } from "@/app/lib/db";
import type { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const connection = await getConnection();

  try {
    const body = await req.json();
    console.log("BODY:", body);

    const { relevamiento_id, servicios } = body;

    if (!Array.isArray(servicios) || servicios.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron servicios" },
        { status: 400 }
      );
    }

    for (const item of servicios) {
      const {
        servicio,
        estado,
        potencia,
        estado_bateria,
        tipo_combustible,
        disponibilidad,
      } = item;

      await connection.query<ResultSetHeader>(
        `INSERT INTO servicio_electricidad (
          servicio,
          estado,
          potencia,
          estado_bateria,
          tipo_combustible,        
          disponibilidad,
          relevamiento_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          servicio,
          estado,
          potencia,
          estado_bateria,
          tipo_combustible,
          disponibilidad,
          relevamiento_id,
        ]
      );
    }

    return NextResponse.json({
      message: "Servicios de electricidad guardados correctamente",
    });
  } catch (error) {
    console.error("Error al guardar servicio electricidad:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}
