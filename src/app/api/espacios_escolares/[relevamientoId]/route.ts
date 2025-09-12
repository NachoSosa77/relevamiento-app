/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  const { relevamientoId } = await params;
  const id = Number(relevamientoId);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const connection = await getConnection();

    const [rows]: any = await connection.query(
      `SELECT cantidad_construcciones, superficie_total_predio, observaciones
       FROM espacios_escolares
       WHERE relevamiento_id = ?`,
      [id]
    );

    connection.release();

    if (!rows.length) {
      return NextResponse.json(null); // No hay datos aún
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("Error al consultar espacios escolares:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  const { relevamientoId } = await params;
  const body = await req.json();
  const { predio_id } = body;

  if (!predio_id) {
    return NextResponse.json(
      { message: "Falta el predio_id" },
      { status: 400 }
    );
  }

  try {
    const connection = await getConnection();

    const [result]: any = await connection.query(
      `UPDATE espacios_escolares
       SET predio_id = ?
       WHERE relevamiento_id = ?`,
      [predio_id, relevamientoId]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      affectedRows: result.affectedRows,
    });
  } catch (err: any) {
    console.error("Error al actualizar espacios_escolares:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
