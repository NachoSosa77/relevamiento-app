/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const localId = Number(id);

    const url = new URL(req.url);
    const relevamientoId = Number(url.searchParams.get("relevamientoId"));

    if (isNaN(localId) || isNaN(relevamientoId)) {
      return NextResponse.json({ message: "IDs inválidos" }, { status: 400 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, abertura, tipo, cantidad, estado, local_id, relevamiento_id
      FROM aberturas
      WHERE local_id = ? AND relevamiento_id = ?
      `,
      [localId, relevamientoId]
    );

    // Por esto:
    if (rows.length === 0) {
      return NextResponse.json([], { status: 200 }); // devolvemos array vacío si no hay datos
    }

    return NextResponse.json(rows); // todas las filas
  } catch (err: any) {
    console.error("❌ Error al obtener dimensiones:", err);
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
  const { id } = await params;
  const aberturaId = Number(id);
  const body = await req.json();

  if (!aberturaId || isNaN(aberturaId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  // Campos permitidos
  const allowedFields = ["abertura", "tipo", "cantidad", "estado"];

  const fields = [];
  const values = [];

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

  values.push(aberturaId);

  try {
    const [result] = await pool.query(
      `UPDATE aberturas SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      message: "Dimensiones actualizadas correctamente",
      result,
    });
  } catch (err: any) {
    console.error("❌ Error al actualizar dimensiones:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
