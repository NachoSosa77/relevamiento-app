/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

interface OpcionAreaExterior extends RowDataPacket {
  id: number;
  nombre: string;
}

export async function GET() {
  try {
    const connection = await getConnection();
    const [opciones] = await connection.query<OpcionAreaExterior[]>(
      "SELECT * FROM opciones_areas_exteriores"
    );
    connection.release();

    return NextResponse.json(opciones);
  } catch (err: any) {
    console.error("Error al obtener las opciones de áreas exteriores:", err);
    return NextResponse.json(
      {
        message: "Error al obtener las opciones de áreas exteriores",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
