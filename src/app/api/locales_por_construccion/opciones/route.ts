/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

interface OpcionLocales extends RowDataPacket {
  id: number;
  name: string;
  tipo: string;
}

export async function GET() {
  try {
    const [opciones] = await pool.query<OpcionLocales[]>(
      "SELECT * FROM opciones_locales"
    );

    return NextResponse.json(opciones);
  } catch (err: any) {
    console.error("Error al obtener las opciones de locales:", err);
    return NextResponse.json(
      {
        message: "Error al obtener las opciones de locales",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
