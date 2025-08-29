/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const connection = await getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      `
      SELECT id, largo_predominante, ancho_predominante, diametro, altura_maxima, altura_minima
      FROM locales_por_construccion
      WHERE id = ?
      `,
      [idNumber]
    );
    connection.release();

    if (rows.length === 0) {
      return NextResponse.json({ message: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
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
  const idNumber = Number(id);
  const body = await req.json();

  if (!idNumber || isNaN(idNumber)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  // Campos permitidos
  const allowedFields = [
    "largo_predominante",
    "ancho_predominante",
    "diametro",
    "altura_maxima",
    "altura_minima",
  ];

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

  values.push(idNumber);

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      `UPDATE locales_por_construccion SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    connection.release();

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
