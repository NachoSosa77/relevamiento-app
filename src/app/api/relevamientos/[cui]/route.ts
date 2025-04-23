/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cui: number }> }
) {
  try {
    const connection = await getConnection();
    const cui = (await params).cui;

    if (isNaN(cui)) {
      return NextResponse.json({ message: "CUI inválido" }, { status: 400 });
    }

    const [rows] = await connection.query(
      "SELECT * FROM relevamientos WHERE cui_id = ?",
      [cui]
    );

    connection.release();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error al traer relevamientos:", error);
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
