import { getConnection } from "@/app/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

// GET para cargar si ya existen datos
export async function GET(req: NextRequest) {
  const relevamiento_id = req.nextUrl.searchParams.get("relevamiento_id");
  const construccion_id = req.nextUrl.searchParams.get("construccion_id");

  if (!relevamiento_id || !construccion_id) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT * FROM uso_comedor WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error en GET uso_comedor:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST: Insertar solo si no existe
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { relevamiento_id, servicios, construccion_id } = body;

    const connection = await getConnection();

    // Verificar si ya existe
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM uso_comedor WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );

    if ((rows as RowDataPacket[])[0].count > 0) {
      return NextResponse.json(
        {
          error: "Ya existe un registro para este relevamiento y construcción",
        },
        { status: 409 }
      );
    }

    // Insertar nuevos
    for (const item of servicios) {
      const { servicio, disponibilidad, tipos_comedor } = item;
      await connection.execute<ResultSetHeader>(
        `INSERT INTO uso_comedor (
    servicio,
    disponibilidad,
    tipos_comedor,
    relevamiento_id,
    construccion_id
  ) VALUES (?, ?, ?, ?, ?)`,
        [
          servicio,
          disponibilidad,
          tipos_comedor !== undefined ? JSON.stringify(tipos_comedor) : null,
          relevamiento_id,
          construccion_id,
        ]
      );
    }

    connection.release();
    return NextResponse.json({ message: "Datos guardados correctamente" });
  } catch (error) {
    console.error("Error al guardar uso_comedor:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PATCH: Actualizar registros existentes
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { relevamiento_id, servicios, construccion_id } = body;

    const connection = await getConnection();

    for (const item of servicios) {
      const { servicio, disponibilidad, tipos_comedor } = item;

      await connection.execute(
        `UPDATE uso_comedor
   SET disponibilidad = ?, tipos_comedor = ?
   WHERE relevamiento_id = ? AND construccion_id = ? AND servicio = ?`,
        [
          disponibilidad ?? null,
          tipos_comedor !== undefined ? JSON.stringify(tipos_comedor) : null,
          relevamiento_id,
          construccion_id,
          servicio,
        ]
      );
    }

    connection.release();
    return NextResponse.json({ message: "Datos actualizados correctamente" });
  } catch (error) {
    console.error("Error en PATCH uso_comedor:", error);
    return NextResponse.json(
      { error: "Error al actualizar datos" },
      { status: 500 }
    );
  }
}
