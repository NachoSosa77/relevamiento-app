import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    if (!Array.isArray(data)) {
      return new NextResponse("El cuerpo debe ser un array", { status: 400 });
    }

    const values = data.map((item) => [
      item.item,
      item.material,
      item.estado,
      item.relevamiento_id,
      item.local_id,
    ]);

    const query = `
      INSERT INTO materiales_predominantes 
        (item, material, estado, relevamiento_id, local_id)
      VALUES ?
    `;

    await connection.query(query, [values]);

    return NextResponse.json({ message: "Insertado correctamente" });
  } catch (error) {
    console.error("Error en POST /materiales_predominantes:", error);
    return new NextResponse("Error del servidor", { status: 500 });
  }
}
