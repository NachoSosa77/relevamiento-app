/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  const { relevamientoId } = await params;
  const id = Number(relevamientoId);

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json(
      { message: "relevamientoId inválido" },
      { status: 400 }
    );
  }

  try {
    const [rows]: any = await pool.query(
      `SELECT id, cantidad_construcciones, superficie_total_predio, observaciones,
              cui, relevamiento_id, predio_id
         FROM espacios_escolares
        WHERE relevamiento_id = ?
        LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      // 🔴 devolvemos 404 para que el front NO muestre banner de edición
      return NextResponse.json({ message: "not_found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (err: any) {
    console.error("Error al consultar espacios_escolares:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  const { relevamientoId } = await params;
  const id = Number(relevamientoId);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json(
      { message: "relevamientoId inválido" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { predio_id } = body;

  if (!predio_id) {
    return NextResponse.json(
      { message: "Falta el predio_id" },
      { status: 400 }
    );
  }

  try {
    const [result]: any = await pool.query(
      `UPDATE espacios_escolares
          SET predio_id = ?
        WHERE relevamiento_id = ?`,
      [predio_id, id]
    );

    return NextResponse.json(
      { success: true, affectedRows: result.affectedRows },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error al actualizar espacios_escolares:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
