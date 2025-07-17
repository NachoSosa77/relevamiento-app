import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export async function POST(req: Request) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    const chunkSize = 100;
    const chunks = chunkArray(data, chunkSize);

    for (const chunk of chunks) {
      const values = chunk.map((item) => [
        item.servicio ?? null,
        item.tipo_instalacion ?? null,
        item.funciona ?? null,
        item.motivo ?? null,
        item.relevamiento_id ?? null,
        item.local_id ?? null,
      ]);

      const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
      const flatValues = values.flat();

      const insertQuery = `
        INSERT INTO instalaciones_basicas 
        (servicio, tipo_instalacion, funciona, motivo, relevamiento_id, local_id)
        VALUES ${placeholders}
      `;

      await connection.execute(insertQuery, flatValues);
    }

    return NextResponse.json(
      { message: "Datos insertados correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error al insertar instalaciones_basicas:", error);
    return NextResponse.json(
      { error: "Error al insertar los datos" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const localId = Number(req.nextUrl.searchParams.get("localId"));
  const relevamientoId = Number(req.nextUrl.searchParams.get("relevamientoId"));

  if (!localId || !relevamientoId) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const connection = await getConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM instalaciones_basicas WHERE local_id = ? AND relevamiento_id = ?`,
    [localId, relevamientoId]
  );

  return NextResponse.json(rows);
}
