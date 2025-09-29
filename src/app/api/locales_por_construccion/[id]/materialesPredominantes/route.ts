/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
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

    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, item, material, estado, local_id, relevamiento_id
      FROM materiales_predominantes
      WHERE local_id = ? AND relevamiento_id = ?
      `,
      [localId, relevamientoId]
    );

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
  const { id } = await params; // acá seguimos usando id como el id del material
  const materialId = Number(id);
  const body = await req.json();

  if (!materialId || isNaN(materialId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  const allowedFields = ["item", "material", "estado"];
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
    const [result] = await pool.query(
      `UPDATE materiales_predominantes SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      message: "Material actualizado correctamente",
      result,
    });
  } catch (err: any) {
    console.error("❌ Error al actualizar materiales:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
