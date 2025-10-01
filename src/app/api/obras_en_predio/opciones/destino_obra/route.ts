/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

interface OpcionObraEnpredio extends RowDataPacket {
  id: number;
  name: string;
  prefijo: string;
}

export async function GET() {
  try {
    const [opciones] = await pool.query<OpcionObraEnpredio[]>(
      "SELECT * FROM destino_obra"
    );

    return NextResponse.json(opciones);
  } catch (err: any) {
    console.error("Error al obtener las opciones de destino de obra:", err);
    return NextResponse.json(
      {
        message: "Error al obtener las opciones de destino de obra",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
