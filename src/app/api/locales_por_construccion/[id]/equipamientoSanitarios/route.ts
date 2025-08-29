/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // este "id" es el local_id
    const localId = Number(id);

    const url = new URL(req.url);
    const relevamientoId = Number(url.searchParams.get("relevamientoId"));

    if (isNaN(localId) || isNaN(relevamientoId)) {
      return NextResponse.json({ message: "IDs inválidos" }, { status: 400 });
    }

    const connection = await getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      `
      SELECT id, cantidad, cantidad_funcionamiento, estado, equipamiento, local_id, relevamiento_id
      FROM equipamiento_sanitarios
      WHERE local_id = ? AND relevamiento_id = ?
      `,
      [localId, relevamientoId]
    );
    connection.release();

    return NextResponse.json(rows); // devolvemos un array
  } catch (err: any) {
    console.error("❌ Error al obtener cantidad_funcionamientoes:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // acá seguimos usando id como el id del cantidad_funcionamiento
  const cantidad_funcionamientoId = Number(id);
  const body = await req.json();

  if (!cantidad_funcionamientoId || isNaN(cantidad_funcionamientoId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  const allowedFields = [
    "cantidad",
    "cantidad_funcionamiento",
    "estado",
    "equipamiento",
  ];
  const fields: string[] = [];
  const values: any[] = [];

  for (const key of allowedFields) {
    if (key in body && body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (fields.length === 0) {
    return NextResponse.json(
      { message: "No hay campos válidos para actualizar" },
      { status: 400 }
    );
  }

  values.push(cantidad_funcionamientoId);

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      `UPDATE equipamiento_cocina_offices SET ${fields.join(
        ", "
      )} WHERE id = ?`,
      values
    );
    connection.release();

    return NextResponse.json({
      message: "cantidad_funcionamiento actualizado correctamente",
      result,
    });
  } catch (err: any) {
    console.error("❌ Error al actualizar cantidad_funcionamientoes:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
