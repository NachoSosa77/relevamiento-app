/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cui: string }> }
) {
  try {
    const { cui } = await params;

    const cuiNumber = Number(cui);

    if (!cui || Number.isNaN(cuiNumber)) {
      return NextResponse.json({ message: "CUI inválido" }, { status: 400 });
    }

    const [rows] = await pool.query(
      "SELECT * FROM relevamientos WHERE cui_id = ?",
      [cuiNumber]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error al traer relevamientos:", error);
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
