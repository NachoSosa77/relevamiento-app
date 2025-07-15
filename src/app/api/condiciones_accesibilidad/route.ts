/* eslint-disable @typescript-eslint/no-explicit-any */
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
      const { servicio, disponibilidad, estado, mantenimiento, cantidad } =
        item;

      // Verificamos si ya existe un registro con mismo servicio, relevamiento y construcción
      const [rows] = await connection.query<any[]>(
        `SELECT id FROM condiciones_accesibilidad
         WHERE servicio = ? AND relevamiento_id = ? AND construccion_id = ?`,
        [servicio, relevamiento_id, construccion_id]
      );

      if (rows.length > 0) {
        // Ya existe: hacer UPDATE
        await connection.query(
          `UPDATE condiciones_accesibilidad SET
            disponibilidad = ?,
            estado = ?,
            mantenimiento = ?,
            cantidad = ?
          WHERE id = ?`,
          [disponibilidad, estado, mantenimiento, cantidad, rows[0].id]
        );
      } else {
        // No existe: hacer INSERT
        await connection.query(
          `INSERT INTO condiciones_accesibilidad (
            servicio,
            disponibilidad,
            estado,
            mantenimiento,
            cantidad,
            relevamiento_id,
            construccion_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            servicio,
            disponibilidad,
            estado,
            mantenimiento,
            cantidad,
            relevamiento_id,
            construccion_id,
          ]
        );
      }
    }

    return NextResponse.json({
      message: "Datos guardados correctamente sin duplicados",
    });
  } catch (error) {
    console.error("Error al guardar condiciones_accesibilidad:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PATCH(req: Request) {
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
        id, // id del registro para update
        servicio,
        disponibilidad,
        estado,
        mantenimiento,
        cantidad,
      } = item;

      if (!id) {
        // Si no hay id, insertamos nuevo registro (opcional)
        await connection.query<ResultSetHeader>(
          `INSERT INTO condiciones_accesibilidad (
            servicio,
            disponibilidad,
            estado,
            mantenimiento,
            cantidad,      
            relevamiento_id,
            construccion_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            servicio,
            disponibilidad,
            estado,
            mantenimiento,
            cantidad,
            relevamiento_id,
            construccion_id,
          ]
        );
      } else {
        // Actualizamos registro existente
        await connection.query<ResultSetHeader>(
          `UPDATE condiciones_accesibilidad SET
            servicio = ?,
            disponibilidad = ?,
            estado = ?,
            mantenimiento = ?,
            cantidad = ?
          WHERE id = ? AND relevamiento_id = ? AND construccion_id = ?`,
          [
            servicio,
            disponibilidad,
            estado,
            mantenimiento,
            cantidad,
            id,
            relevamiento_id,
            construccion_id,
          ]
        );
      }
    }

    return NextResponse.json({
      message:
        "Relevamiento condiciones accesibilidad actualizados correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar relevamiento:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function GET(req: Request) {
  const connection = await getConnection();

  try {
    const url = new URL(req.url);
    const relevamiento_id = url.searchParams.get("relevamiento_id");
    const construccion_id = url.searchParams.get("construccion_id");

    if (!relevamiento_id || !construccion_id) {
      return NextResponse.json(
        { error: "Faltan parámetros relevamiento_id o construccion_id" },
        { status: 400 }
      );
    }

    const [rows] = await connection.query(
      `SELECT id, servicio, disponibilidad, estado, mantenimiento, cantidad 
       FROM condiciones_accesibilidad 
       WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener condiciones accesibilidad:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}
