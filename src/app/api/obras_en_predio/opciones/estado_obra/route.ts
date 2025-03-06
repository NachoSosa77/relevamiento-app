/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

interface OpcionObraEnpredio extends RowDataPacket {
  id: number;
  name: string;
  prefijo: string;
}

export async function GET() {
  try {
    const connection = await getConnection();
    const [opciones] = await connection.query<OpcionObraEnpredio[]>(
      "SELECT * FROM estado_obra"
    );
    connection.release();

    return NextResponse.json(opciones);
  } catch (err: any) {
    console.error("Error al obtener las opciones de estado de obra:", err);
    return NextResponse.json(
      {
        message: "Error al obtener las opciones de estado de obra",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
