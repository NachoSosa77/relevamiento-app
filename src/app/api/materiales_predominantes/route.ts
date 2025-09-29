// En /api/materiales_predominantes

// Asegúrate de importar 'pool' directamente
import { pool } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Ya no necesitas 'connection = await getConnection();'
    const data = await req.json();

    // ... (Tu lógica de validación) ...

    type MaterialPredominante = {
      item?: string;
      material?: string;
      estado?: string;
      relevamiento_id?: number;
      local_id?: number;
    };

    const values = (data as MaterialPredominante[]).map(
      (item: MaterialPredominante) => [
        item.item ?? null,
        item.material ?? null,
        item.estado ?? null,
        item.relevamiento_id ?? null,
        item.local_id ?? null,
      ]
    );

    const query = `
      INSERT INTO materiales_predominantes 
        (item, material, estado, relevamiento_id, local_id)
      VALUES ${values.map(() => "(?, ?, ?, ?, ?)").join(", ")}
      ON DUPLICATE KEY UPDATE 
        material = VALUES(material),
        estado = VALUES(estado)
    `;

    const flatValues = values.flat();
    await pool.execute(query, flatValues); // <--- CAMBIO AQUÍ: pool.execute()

    return NextResponse.json({
      message: "Insertado o actualizado correctamente",
    });
  } catch (error) {
    console.error("Error en POST /materiales_predominantes:", error);
    return new NextResponse("Error del servidor", { status: 500 });
  }
  // ¡Ya no necesitas el bloque finally para connection.release()!
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

    // Ya no necesitas 'connection = await getConnection();'
    const [rows] = await pool.execute(
      // <--- CAMBIO AQUÍ: pool.execute()
      `SELECT * FROM materiales_predominantes WHERE local_id = ? AND relevamiento_id = ?`,
      [localId, relevamientoId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error en GET /materiales_predominantes:", error);
    return new NextResponse("Error del servidor", { status: 500 });
  }
  // ¡Ya no necesitas el bloque finally para connection.release()!
}
