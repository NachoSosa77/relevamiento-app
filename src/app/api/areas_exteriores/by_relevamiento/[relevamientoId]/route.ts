/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface AreaExterior extends RowDataPacket {
  id: number;
  cui_number: number;
  relevamiento_id: number;
  identificacion_plano: string;
  tipo: string;
  superficie: string;
  estado_conservacion?: string;
  terminacion_piso?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  try {
    const relevamientoId = (await params).relevamientoId;

    if (!relevamientoId) {
      return NextResponse.json(
        { message: "Falta el parámetro relevamientoId" },
        { status: 400 }
      );
    }

    const [areasExteriores] = await pool.query<AreaExterior[]>(
      "SELECT * FROM areas_exteriores WHERE relevamiento_id = ?",
      [Number(relevamientoId)]
    );

    return NextResponse.json({ areasExteriores });
  } catch (err: any) {
    console.error("Error al obtener áreas exteriores:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
