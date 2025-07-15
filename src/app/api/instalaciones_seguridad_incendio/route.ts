import { getConnection } from "@/app/lib/db";
import type { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const connection = await getConnection();

  try {
    const body = await req.json();

    const { relevamiento_id, servicios, construccion_id } = body;

    if (!Array.isArray(servicios) || servicios.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron servicios" },
        { status: 400 }
      );
    }

    for (const item of servicios) {
      const {
        servicio,
        disponibilidad,
        carga_anual_matafuegos,
        simulacros_evacuacion,
        cantidad,
      } = item;

      await connection.query<ResultSetHeader>(
        `INSERT INTO instalaciones_seguridad_incendio (
          servicio,
          disponibilidad,
          carga_anual_matafuegos,
          simulacros_evacuacion,
          cantidad,      
          relevamiento_id,
          construccion_id
        ) VALUES (?, ?, ?, ?, ?,?,?)`,
        [
          servicio,
          disponibilidad,
          carga_anual_matafuegos,
          simulacros_evacuacion,
          cantidad,
          relevamiento_id,
          construccion_id,
        ]
      );
    }

    return NextResponse.json({
      message:
        "Relevamiento Instalaciones de seguridad guardados correctamente",
    });
  } catch (error) {
    console.error("Error al guardar relevamiento:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function GET(req: Request) {
  const connection = await getConnection();

  const { searchParams } = new URL(req.url);
  const relevamiento_id = searchParams.get("relevamiento_id");
  const construccion_id = searchParams.get("construccion_id");

  if (!relevamiento_id || !construccion_id) {
    return NextResponse.json(
      { error: "Faltan parámetros requeridos" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await connection.query(
      `SELECT * FROM instalaciones_seguridad_incendio
       WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error en GET seguridad incendio:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PATCH(req: Request) {
  const connection = await getConnection();

  try {
    const body = await req.json();
    const { relevamiento_id, construccion_id, servicios } = body;

    if (!relevamiento_id || !construccion_id || !Array.isArray(servicios)) {
      return NextResponse.json(
        { error: "Datos incompletos para actualizar" },
        { status: 400 }
      );
    }

    // Eliminar los anteriores (simplificado)
    await connection.query(
      `DELETE FROM instalaciones_seguridad_incendio
       WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );

    // Insertar los nuevos
    for (const item of servicios) {
      const {
        servicio,
        disponibilidad,
        carga_anual_matafuegos,
        simulacros_evacuacion,
        cantidad,
      } = item;

      await connection.query<ResultSetHeader>(
        `INSERT INTO instalaciones_seguridad_incendio (
          servicio,
          disponibilidad,
          carga_anual_matafuegos,
          simulacros_evacuacion,
          cantidad,
          relevamiento_id,
          construccion_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          servicio,
          disponibilidad,
          carga_anual_matafuegos,
          simulacros_evacuacion,
          cantidad,
          relevamiento_id,
          construccion_id,
        ]
      );
    }

    return NextResponse.json({
      message:
        "Actualización de instalaciones de seguridad realizada correctamente",
    });
  } catch (error) {
    console.error("Error en PATCH seguridad incendio:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}
