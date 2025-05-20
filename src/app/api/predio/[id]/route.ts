/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const connection = await getConnection();
  const { id: relevamiento_id } = await params;

  if (!relevamiento_id) {
    return NextResponse.json(
      { message: "Falta el parámetro relevamiento_id" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await connection.query(
      `SELECT 
  id,
  cantidad_construcciones,
  superficie_total_predio,
  cui,
  observaciones,
  relevamiento_id
FROM espacios_escolares
WHERE relevamiento_id = ?`,
      [relevamiento_id]
    );

    connection.release();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error al obtener instituciones:", error);
    connection.release();
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const connection = await getConnection();
  const { id } = await params;

  try {
    const body = await req.json();
    const { observaciones } = body;

    if (!observaciones) {
      return NextResponse.json(
        { message: "Falta el campo 'observaciones'" },
        { status: 400 }
      );
    }

    const [result] = await connection.query(
      `UPDATE espacios_escolares SET observaciones = ? WHERE id = ?`,
      [observaciones, id]
    );

    connection.release();

    return NextResponse.json({
      message: "Observaciones actualizadas correctamente",
      result,
    });
  } catch (error: any) {
    console.error("Error al actualizar observaciones:", error);
    connection.release();
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
