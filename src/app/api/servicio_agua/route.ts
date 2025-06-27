/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/servicio_agua/route.ts
import { getConnection } from "@/app/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const relevamiento_id = searchParams.get("relevamiento_id");
  const construccion_id = searchParams.get("construccion_id");

  if (!relevamiento_id || !construccion_id) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const connection = await getConnection();

  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM servicio_agua WHERE relevamiento_id = ? AND construccion_id = ? LIMIT 1`,
      [relevamiento_id, construccion_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(null);
    }

    const data = rows[0];

    // Aseguramos que los campos JSON se devuelvan como string JSON (no objetos ni strings planos)
    const safeField = (field: any) =>
      typeof field === "string" ? field : JSON.stringify(field ?? []);

    return NextResponse.json({
      ...data,
      tipo_provision: safeField(data.tipo_provision),
      tipo_provision_estado: safeField(data.tipo_provision_estado),
      tipo_almacenamiento: safeField(data.tipo_almacenamiento),
      tipo_almacenamiento_estado: safeField(data.tipo_almacenamiento_estado),
      alcance: safeField(data.alcance),
    });
  } catch (error) {
    console.error("Error al obtener servicio de agua:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

export async function POST(req: Request) {
  const connection = await getConnection();

  try {
    const body = await req.json();
    const {
      tipo_provision,
      tipo_provision_estado,
      tipo_almacenamiento,
      tipo_almacenamiento_estado,
      alcance,
      tratamiento,
      tipo_tratamiento,
      control_sanitario,
      cantidad_veces,
      relevamiento_id,
      construccion_id,
    } = body;

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO servicio_agua (
        tipo_provision,
        tipo_provision_estado,
        tipo_almacenamiento,
        tipo_almacenamiento_estado,
        alcance,
        tratamiento,
        tipo_tratamiento,
        control_sanitario,
        cantidad_veces,
        relevamiento_id,
        construccion_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        JSON.stringify(tipo_provision),
        JSON.stringify(tipo_provision_estado),
        JSON.stringify(tipo_almacenamiento),
        JSON.stringify(tipo_almacenamiento_estado),
        JSON.stringify(alcance),
        tratamiento,
        tipo_tratamiento,
        control_sanitario,
        cantidad_veces,
        relevamiento_id,
        construccion_id,
      ]
    );

    return NextResponse.json({
      message: "Servicio de agua guardado correctamente",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Error al guardar servicio_agua:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PATCH(req: Request) {
  const connection = await getConnection();

  try {
    const body = await req.json();
    const {
      tipo_provision,
      tipo_provision_estado,
      tipo_almacenamiento,
      tipo_almacenamiento_estado,
      alcance,
      tratamiento,
      tipo_tratamiento,
      control_sanitario,
      cantidad_veces,
      relevamiento_id,
      construccion_id,
    } = body;

    if (!relevamiento_id || !construccion_id) {
      return NextResponse.json(
        { error: "Faltan identificadores" },
        { status: 400 }
      );
    }

    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE servicio_agua SET
        tipo_provision = ?,
        tipo_provision_estado = ?,
        tipo_almacenamiento = ?,
        tipo_almacenamiento_estado = ?,
        alcance = ?,
        tratamiento = ?,
        tipo_tratamiento = ?,
        control_sanitario = ?,
        cantidad_veces = ?
      WHERE relevamiento_id = ? AND construccion_id = ?`,
      [
        JSON.stringify(tipo_provision),
        JSON.stringify(tipo_provision_estado),
        JSON.stringify(tipo_almacenamiento),
        JSON.stringify(tipo_almacenamiento_estado),
        JSON.stringify(alcance),
        tratamiento,
        tipo_tratamiento,
        control_sanitario,
        cantidad_veces,
        relevamiento_id,
        construccion_id,
      ]
    );

    return NextResponse.json({
      message: "Servicio de agua actualizado correctamente",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error al actualizar servicio_agua:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}
