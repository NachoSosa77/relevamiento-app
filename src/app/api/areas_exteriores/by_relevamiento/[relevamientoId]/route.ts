/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
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

interface Params {
  params: {
    relevamientoId: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const connection = await getConnection();
    const { relevamientoId } = await params;

    if (!relevamientoId) {
      return NextResponse.json(
        { message: "Falta el parámetro relevamientoId" },
        { status: 400 }
      );
    }

    const [areasExteriores] = await connection.query<AreaExterior[]>(
      "SELECT * FROM areas_exteriores WHERE relevamiento_id = ?",
      [Number(relevamientoId)]
    );

    connection.release();

    return NextResponse.json({ areasExteriores });
  } catch (err: any) {
    console.error("Error al obtener áreas exteriores:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
