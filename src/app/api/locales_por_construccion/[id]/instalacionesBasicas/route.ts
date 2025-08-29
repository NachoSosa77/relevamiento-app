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
      SELECT id, servicio, tipo_instalacion, funciona, motivo, local_id, relevamiento_id
      FROM instalaciones_basicas
      WHERE local_id = ? AND relevamiento_id = ?
      `,
      [localId, relevamientoId]
    );
    connection.release();

    return NextResponse.json(rows); // devolvemos un array
  } catch (err: any) {
    console.error("❌ Error al obtener materiales:", err);
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
  const { id } = await params; // acá seguimos usando id como el id del tipo_instalacion
  const materialId = Number(id);
  const body = await req.json();

  if (!materialId || isNaN(materialId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  const allowedFields = ["servicio", "tipo_instalacion", "funciona", "motivo"];
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

  values.push(materialId);

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      `UPDATE instalaciones_basicas SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    connection.release();

    return NextResponse.json({
      message: "Instalaciones actualizadas correctamente",
      result,
    });
  } catch (err: any) {
    console.error("❌ Error al actualizar instalaciones:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
