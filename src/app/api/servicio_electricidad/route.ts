/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import type { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const relevamiento_id = url.searchParams.get("relevamiento_id");
  const construccion_id = url.searchParams.get("construccion_id");

  if (!relevamiento_id || !construccion_id) {
    return NextResponse.json(
      { error: "Faltan parámetros relevamiento_id o construccion_id" },
      { status: 400 }
    );
  }

  const connection = await getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT * FROM servicio_electricidad WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener servicios electricidad:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}

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

    await connection.beginTransaction();

    // Borrar previos para evitar duplicados
    await connection.query(
      `DELETE FROM servicio_electricidad WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );

    for (const item of servicios) {
      const {
        servicio,
        estado,
        potencia,
        estado_bateria,
        tipo_combustible,
        disponibilidad,
      } = item;

      await connection.query<ResultSetHeader>(
        `INSERT INTO servicio_electricidad (
          servicio,
          estado,
          potencia,
          estado_bateria,
          tipo_combustible,        
          disponibilidad,
          relevamiento_id,
          construccion_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          servicio,
          estado,
          potencia,
          estado_bateria,
          tipo_combustible,
          disponibilidad,
          relevamiento_id,
          construccion_id,
        ]
      );
    }

    await connection.commit();

    return NextResponse.json({
      message: "Servicios de electricidad guardados correctamente",
    });
  } catch (error) {
    console.error("Error al guardar servicio electricidad:", error);
    await connection.rollback();
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
        { error: "Faltan datos o datos inválidos" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    for (const item of servicios) {
      const {
        servicio,
        estado,
        potencia,
        estado_bateria,
        tipo_combustible,
        disponibilidad,
      } = item;

      // Intentamos actualizar el registro, si no existe hacemos insert
      const [result] = await connection.query(
        `UPDATE servicio_electricidad SET
          estado = ?,
          potencia = ?,
          estado_bateria = ?,
          tipo_combustible = ?,
          disponibilidad = ?
        WHERE relevamiento_id = ? AND construccion_id = ? AND servicio = ?`,
        [
          estado,
          potencia,
          estado_bateria,
          tipo_combustible,
          disponibilidad,
          relevamiento_id,
          construccion_id,
          servicio,
        ]
      );

      // Si no actualizó ninguna fila, insertamos
      if ((result as any).affectedRows === 0) {
        await connection.query(
          `INSERT INTO servicio_electricidad (
            servicio,
            estado,
            potencia,
            estado_bateria,
            tipo_combustible,
            disponibilidad,
            relevamiento_id,
            construccion_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            servicio,
            estado,
            potencia,
            estado_bateria,
            tipo_combustible,
            disponibilidad,
            relevamiento_id,
            construccion_id,
          ]
        );
      }
    }

    await connection.commit();

    return NextResponse.json({
      message: "Servicios electricidad actualizados correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar servicios electricidad:", error);
    await connection.rollback();
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}
