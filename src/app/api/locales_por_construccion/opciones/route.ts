/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

interface OpcionLocales extends RowDataPacket {
  id: number;
  name: string;
  tipo: string;
}

export async function GET() {
  try {
    const connection = await getConnection();
    const [opciones] = await connection.query<OpcionLocales[]>(
      "SELECT * FROM locales"
    );
    connection.release();

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
