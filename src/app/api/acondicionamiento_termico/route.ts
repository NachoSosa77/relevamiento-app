import { getConnection } from "@/app/lib/db";
import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import pLimit from "p-limit";

interface AcondicionamientoItem {
  cantidad?: number;
  disponibilidad?: string;
  temperatura?: string;
  tipo?: string;
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

export async function POST(req: NextRequest) {
  let connection: PoolConnection | undefined;

  try {
    connection = await getConnection();
    const data: AcondicionamientoItem[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array" },
        { status: 400 }
      );
    }

    const chunkSize = 50;
    const chunks = chunkArray(data, chunkSize);
    const limit = pLimit(3);

    const insertQuery = `
      INSERT INTO acondicionamiento_termico (
        cantidad, disponibilidad, temperatura, tipo, relevamiento_id, local_id
      ) VALUES ?
      ON DUPLICATE KEY UPDATE
        cantidad = VALUES(cantidad),
        disponibilidad = VALUES(disponibilidad),
        temperatura = VALUES(temperatura),
        tipo = VALUES(tipo)
    `;

    await Promise.all(
      chunks.map((chunk) =>
        limit(async () => {
          const values = chunk.map((item) => [
            item.cantidad ?? null,
            item.disponibilidad ?? null,
            item.temperatura ?? null,
            item.tipo ?? null,
            item.relevamiento_id,
            item.local_id,
          ]);

          await connection!.query<RowDataPacket[]>(insertQuery, [values]);
        })
      )
    );

    return NextResponse.json(
      { message: "Datos insertados/actualizados correctamente" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "Error al insertar/actualizar acondicionamiento_termico:",
      error
    );

    const details = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: "Error al insertar/actualizar los datos", details },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

export async function GET(req: NextRequest) {
  const localId = Number(req.nextUrl.searchParams.get("localId"));
  const relevamientoId = Number(req.nextUrl.searchParams.get("relevamientoId"));

  if (!localId || !relevamientoId) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const connection = await getConnection();

  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT * FROM acondicionamiento_termico WHERE local_id = ? AND relevamiento_id = ?`,
    [localId, relevamientoId]
  );

  return NextResponse.json(rows);
}
