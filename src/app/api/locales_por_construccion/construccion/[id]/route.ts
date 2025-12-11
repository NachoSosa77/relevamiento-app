import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // id viene como string
    const construccionId = Number(id);

    if (Number.isNaN(construccionId)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const [rows] = await pool.query(
      `SELECT * FROM locales_por_construccion WHERE construccion_id = ?`,
      [construccionId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener los locales:", error);
    return NextResponse.json(
      { message: "Error al obtener los locales", error },
      { status: 500 }
    );
  }
}
