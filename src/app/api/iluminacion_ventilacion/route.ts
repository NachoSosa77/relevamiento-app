import { pool } from "@/app/lib/db"; // 🔹 MODIFICACIÓN CLAVE: Importamos 'pool'
import { RowDataPacket } from "mysql2/promise"; // Necesario para tipado
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { localId, relevamientoId, payload } = body;

    if (!localId || !relevamientoId || !Array.isArray(payload)) {
      return NextResponse.json(
        { error: "Datos inválidos en la request" },
        { status: 400 }
      );
    }

    const values = payload.map((item: any) => [
      localId,
      relevamientoId,
      item.condicion,
      item.disponibilidad ?? null,
      item.superficie_iluminacion ?? null,
      item.superficie_ventilacion ?? null,
    ]);

    const insertQuery = `
      INSERT INTO iluminacion_ventilacion 
        (local_id, relevamiento_id, condicion, disponibilidad, superficie_iluminacion, superficie_ventilacion)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        disponibilidad = VALUES(disponibilidad),
        superficie_iluminacion = VALUES(superficie_iluminacion),
        superficie_ventilacion = VALUES(superficie_ventilacion)
    `;

    console.time("Insert chunk");
    await pool.query(insertQuery, [values]);
    console.timeEnd("Insert chunk");

    return NextResponse.json({ success: true, rows: values.length });
  } catch (error: any) {
    console.error("Error en POST iluminacion_ventilacion:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      condicion,
      disponibilidad,
      superficie_iluminacion,
      superficie_ventilacion,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Falta el campo id en el body" },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE iluminacion_ventilacion
      SET
        condicion = COALESCE(?, condicion),
        disponibilidad = COALESCE(?, disponibilidad),
        superficie_iluminacion = COALESCE(?, superficie_iluminacion),
        superficie_ventilacion = COALESCE(?, superficie_ventilacion)
      WHERE id = ?
    `;

    const [result]: any = await pool.query(updateQuery, [
      condicion ?? null,
      disponibilidad ?? null,
      superficie_iluminacion ?? null,
      superficie_ventilacion ?? null,
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "No se encontró registro para actualizar" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, updated: result.affectedRows });
  } catch (error: any) {
    console.error("Error en PATCH iluminacion_ventilacion:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
