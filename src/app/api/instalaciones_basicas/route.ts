import { getConnection } from "@/app/lib/db";
import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import pLimit from "p-limit";

// Tipado del payload
interface InstalacionBasicaItem {
  servicio?: string;
  tipo_instalacion?: string;
  funciona?: string;
  motivo?: string;
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
  let connection: PoolConnection | undefined;

  try {
    connection = await getConnection();
    const data: InstalacionBasicaItem[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    const chunkSize = 100;
    const chunks = chunkArray(data, chunkSize);
    const limit = pLimit(3);

    await Promise.all(
      chunks.map((chunk) =>
        limit(async () => {
          const values = chunk.map((item) => [
            item.servicio ?? null,
            item.tipo_instalacion ?? null,
            item.funciona ?? null,
            item.motivo ?? null,
            item.relevamiento_id,
            item.local_id,
          ]);

          const placeholders = values
            .map(() => "(?, ?, ?, ?, ?, ?)")
            .join(", ");
          const flatValues = values.flat();

          const insertQuery = `
            INSERT INTO instalaciones_basicas 
            (servicio, tipo_instalacion, funciona, motivo, relevamiento_id, local_id)
            VALUES ${placeholders}
          `;

          await connection!.execute(insertQuery, flatValues);
        })
      )
    );

    return NextResponse.json(
      { message: "Datos insertados correctamente" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ Error al insertar instalaciones_basicas:", error);

    const details = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: "Error al insertar los datos", details },
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
    `SELECT * FROM instalaciones_basicas WHERE local_id = ? AND relevamiento_id = ?`,
    [localId, relevamientoId]
  );

  return NextResponse.json(rows);
}
