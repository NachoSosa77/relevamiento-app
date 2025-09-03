import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    if (!Array.isArray(data)) {
      return new NextResponse("El cuerpo debe ser un array", { status: 400 });
    }

    // Validación opcional: verificar campos requeridos
    for (const [index, item] of data.entries()) {
      if (
        item.item == null ||
        item.relevamiento_id == null ||
        item.local_id == null
      ) {
        return new NextResponse(`Faltan campos en la fila ${index + 1}`, {
          status: 400,
        });
      }
    }

    // Reemplazar undefined por null antes de insertar
    const values = data.map((item) => [
      item.item ?? null,
      item.material ?? null,
      item.estado ?? null,
      item.relevamiento_id ?? null,
      item.local_id ?? null,
    ]);

    const query = `
      INSERT INTO materiales_predominantes 
        (item, material, estado, relevamiento_id, local_id)
      VALUES ${values.map(() => "(?, ?, ?, ?, ?)").join(", ")}
    `;

    const flatValues = values.flat();

    await connection.execute(query, flatValues);

    return NextResponse.json({ message: "Insertado correctamente" });
  } catch (error) {
    console.error("Error en POST /materiales_predominantes:", error);
    return new NextResponse("Error del servidor", { status: 500 });
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
    `SELECT * FROM materiales_predominantes WHERE local_id = ? AND relevamiento_id = ?`,
    [localId, relevamientoId]
  );

  return NextResponse.json(rows);
}
