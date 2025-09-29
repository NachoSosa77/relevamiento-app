// En /api/aberturas

// Asegúrate de importar 'pool' directamente
import { pool } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Ya no necesitas 'connection = await getConnection();'
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Payload debe ser un array" },
        { status: 400 }
      );
    }

    const values = data.map((item) => [
      item.abertura ?? null,
      item.tipo ?? null,
      item.estado ?? null,
      item.cantidad ?? null,
      item.relevamiento_id ?? null,
      item.local_id ?? null,
    ]);

    const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    const flatValues = values.flat();

    const query = `
      INSERT INTO aberturas (abertura, tipo, estado, cantidad, relevamiento_id, local_id)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        estado = VALUES(estado),
        cantidad = VALUES(cantidad)
    `;

    await pool.execute(query, flatValues); // <--- Usa pool.execute() directamente

    return NextResponse.json(
      { message: "Insertado o actualizado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /aberturas:", error);
    return NextResponse.json(
      { error: "Error al insertar/actualizar aberturas" },
      { status: 500 }
    );
  }
  // ¡No se necesita finally para release() aquí!
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

    // Ya no necesitas 'connection = await getConnection();'
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
