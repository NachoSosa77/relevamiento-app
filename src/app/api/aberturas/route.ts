// En /api/aberturas

// Asegúrate de importar 'pool' directamente
import { pool } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!Array.isArray(data) || data.length === 0)
      return NextResponse.json({ error: "Payload vacío" }, { status: 400 });

    const insertQuery = `
      INSERT INTO aberturas (abertura, tipo, estado, cantidad, relevamiento_id, local_id)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        estado = VALUES(estado),
        cantidad = VALUES(cantidad)
    `;

    // convertir cada objeto a array
    const values = data.map((item) => [
      item.abertura ?? null,
      item.tipo ?? null,
      item.estado ?? null,
      item.cantidad ?? null,
      item.relevamiento_id ?? null,
      item.local_id ?? null,
    ]);

    // un solo query, pool.query con array de arrays funciona bien
    await pool.query(insertQuery, [values]);

    return NextResponse.json({
      message: "Insertado o actualizado correctamente",
    });
  } catch (error: any) {
    console.error("Error en POST /aberturas:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Añade un try-catch para un manejo consistente de errores
    const localId = Number(req.nextUrl.searchParams.get("localId"));
    const relevamientoId = Number(
      req.nextUrl.searchParams.get("relevamientoId")
    );

    if (!localId || !relevamientoId) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    const [rows] = await pool.execute(
      // <--- Usa pool.execute() directamente
      `SELECT * FROM aberturas WHERE local_id = ? AND relevamiento_id = ?`,
      [localId, relevamientoId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    // Manejo de errores para GET
    console.error("Error en GET /aberturas:", error);
    return NextResponse.json(
      { error: "Error al obtener aberturas" },
      { status: 500 }
    );
  }
  // ¡No se necesita finally para release() aquí!
}
