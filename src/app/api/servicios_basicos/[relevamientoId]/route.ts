/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface ServiciosBasicos extends RowDataPacket {
  id: number;
  id_servicio: string;
  relevamiento_id: number;
  servicio: string;
  disponibilidad: string;
  distancia: string;
  en_predio: string;
  prestadores: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  try {
    const connection = await getConnection();
    const relevamientoId = (await params).relevamientoId;

    if (!relevamientoId) {
      return NextResponse.json(
        { message: "Falta el parámetro relevamientoId" },
        { status: 400 }
      );
    }

    const [serviciosBasicos] = await connection.query<ServiciosBasicos[]>(
      "SELECT * FROM servicios_basicos WHERE relevamiento_id = ?",
      [Number(relevamientoId)]
    );

    connection.release();

    return NextResponse.json({ serviciosBasicos });
  } catch (err: any) {
    console.error("Error al obtener áreas exteriores:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
