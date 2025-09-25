import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    if (!Array.isArray(data)) {
      return new NextResponse("El cuerpo debe ser un array", { status: 400 });
    }

    // Validar campos requeridos
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

    // Preparar valores
    const values = data.map((item) => [
      item.item ?? null,
      item.material ?? null,
      item.estado ?? null,
      item.relevamiento_id ?? null,
      item.local_id ?? null,
    ]);

    // Query con ON DUPLICATE KEY UPDATE
    const query = `
      INSERT INTO materiales_predominantes 
        (item, material, estado, relevamiento_id, local_id)
      VALUES ${values.map(() => "(?, ?, ?, ?, ?)").join(", ")}
      ON DUPLICATE KEY UPDATE 
        material = VALUES(material),
        estado = VALUES(estado)
    `;

    const flatValues = values.flat();
    await connection.execute(query, flatValues);

    return NextResponse.json({
      message: "Insertado o actualizado correctamente",
    });
  } catch (error) {
    console.error("Error en POST /materiales_predominantes:", error);
    return new NextResponse("Error del servidor", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const localId = Number(req.nextUrl.searchParams.get("localId"));
    const relevamientoId = Number(
      req.nextUrl.searchParams.get("relevamientoId")
    );

    if (!localId || !relevamientoId) {
      return new NextResponse("Faltan parámetros localId o relevamientoId", {
        status: 400,
      });
    }

    const connection = await getConnection();

    const [rows] = await connection.execute(
      `SELECT * FROM materiales_predominantes WHERE local_id = ? AND relevamiento_id = ?`,
      [localId, relevamientoId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error en GET /materiales_predominantes:", error);
    return new NextResponse("Error del servidor", { status: 500 });
  }
}
