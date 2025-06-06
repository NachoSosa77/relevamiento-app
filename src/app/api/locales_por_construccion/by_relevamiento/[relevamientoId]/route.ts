/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface LocalPorConstruccion extends RowDataPacket {
  id: number;
  local_id: number;
  relevamiento_id: number;
  cui_number: number;
  numero_construccion: number;
  numero_planta: number;
  identificacion_plano: number;
  tipo: string;
  nombre_local: string;
  estado: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  try {
    const connection = await getConnection();
    const { relevamientoId } = await params; // <-- mantenemos el await por el bug

    if (!relevamientoId) {
      return NextResponse.json(
        { message: "Falta el parámetro relevamientoId" },
        { status: 400 }
      );
    }

    const [localesPorRelevamiento] = await connection.query<
      LocalPorConstruccion[]
    >(
      `
        SELECT 
          lpc.id,
          lpc.local_id,
          lpc.relevamiento_id,
          lpc.cui_number,
          lpc.numero_construccion,
          lpc.numero_planta,
          loc.tipo,
          identificacion_plano,
          estado,
          loc.name AS nombre_local
        FROM locales_por_construccion lpc
        JOIN opciones_locales loc ON lpc.local_id = loc.id
        WHERE lpc.relevamiento_id = ? 
      `,
      [Number(relevamientoId)]
    );

    connection.release();

    return NextResponse.json({ locales: localesPorRelevamiento });
  } catch (err: any) {
    console.error("Error al obtener locales:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
