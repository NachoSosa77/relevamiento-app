/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

interface OpcionTerminacionPiso extends RowDataPacket {
  id: number;
  name: string;
  prefijo: string;
}

export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query<OpcionTerminacionPiso[]>(
      "SELECT name, prefijo FROM opciones_terminacion_piso"
    );
    connection.release();

    // Formateamos las opciones como "A - Baldosas/mosaicos"
    const opciones = rows.map((row) => `${row.prefijo} - ${row.name}`);

    return NextResponse.json(opciones);
  } catch (err: any) {
    console.error("Error al obtener opciones de terminación del piso:", err);
    return NextResponse.json(
      { message: "Error al obtener opciones", error: err.message },
      { status: 500 }
    );
  }
}
