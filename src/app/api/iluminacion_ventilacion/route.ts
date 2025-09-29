import { pool } from "@/app/lib/db"; // 🔹 MODIFICACIÓN CLAVE: Importamos 'pool'
import { RowDataPacket } from "mysql2/promise"; // Necesario para tipado
import { NextRequest, NextResponse } from "next/server";

// Definición de la interfaz
interface IluminacionVentilacionItem {
  id?: number;
  condicion?: string;
  disponibilidad?: string;
  superficie_iluminacion?: number;
  superficie_ventilacion?: number;
  relevamiento_id: number;
  local_id: number;
}

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export async function POST(req: Request) {
  try {
    // 🔹 Eliminada la llamada a getConnection()
    const data: IluminacionVentilacionItem[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO iluminacion_ventilacion (
        condicion, disponibilidad, superficie_iluminacion, superficie_ventilacion, relevamiento_id, local_id
      ) VALUES ?
      ON DUPLICATE KEY UPDATE
        condicion = VALUES(condicion),
        disponibilidad = VALUES(disponibilidad),
        superficie_iluminacion = VALUES(superficie_iluminacion),
        superficie_ventilacion = VALUES(superficie_ventilacion)
    `;

    // Chunk de 100 filas
    const chunkSize = 100;
    const chunks = chunkArray(data, chunkSize);

    for (const chunk of chunks) {
      const values = chunk.map((item) => [
        item.condicion ?? null,
        item.disponibilidad ?? null,
        item.superficie_iluminacion ?? null,
        item.superficie_ventilacion ?? null,
        item.relevamiento_id,
        item.local_id,
      ]);

      // 🔹 MODIFICACIÓN CLAVE: Usamos pool.query() para el batch insert
      await pool.query(insertQuery, [values]);
    }

    return NextResponse.json(
      { message: "Datos insertados/actualizados correctamente" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "Error al insertar/actualizar iluminacion_ventilacion:",
      error
    );
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al insertar/actualizar los datos", details },
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

    // 🔹 Eliminada la llamada a getConnection()
    // 🔹 MODIFICACIÓN CLAVE: Usamos pool.execute() directamente
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM iluminacion_ventilacion WHERE local_id = ? AND relevamiento_id = ?`,
      [localId, relevamientoId]
    );

    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("Error al obtener iluminacion_ventilacion:", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al obtener los datos", details },
      { status: 500 }
    );
  }
}
