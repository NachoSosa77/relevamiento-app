import { getConnection } from "@/app/lib/db";
import type { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

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
        relevamiento_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tipo_provision,
        tipo_provision_estado,
        tipo_almacenamiento,
        tipo_almacenamiento_estado,
        JSON.stringify(alcance),
        tratamiento,
        tipo_tratamiento,
        control_sanitario,
        cantidad_veces,
        relevamiento_id,
      ]
    );

    return NextResponse.json({
      message: "Servicio de agua guardado",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Error al guardar servicio_agua:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    connection.release();
  }
}
