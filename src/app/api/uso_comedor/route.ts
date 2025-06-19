import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { relevamiento_id, servicios, construccion_id } = body;

    const connection = await getConnection();

    for (const item of servicios) {
      const { servicio, disponibilidad, tipos_comedor } = item;

      await connection.query<ResultSetHeader>(
        `INSERT INTO uso_comedor (
          servicio,
          disponibilidad,
          tipos_comedor,
          relevamiento_id,
          construccion_id
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          servicio,
          disponibilidad,
          JSON.stringify(tipos_comedor),
          relevamiento_id,
          construccion_id,
        ]
      );
    }

    return Response.json({ message: "Datos guardados correctamente" });
  } catch (error) {
    console.error("Error al guardar uso_comedor:", error);
    return new Response("Error al guardar uso_comedor", { status: 500 });
  }
}
