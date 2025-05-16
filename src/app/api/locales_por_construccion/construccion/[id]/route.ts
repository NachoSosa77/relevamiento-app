import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const construccionId = parseInt(params.id);
    const connection = await getConnection();

    const [rows] = await connection.query(
      `SELECT * FROM locales_por_construccion WHERE construccion_id = ?`,
      [construccionId]
    );

    connection.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener los locales:", error);
    return NextResponse.json(
      { message: "Error al obtener los locales", error },
      { status: 500 }
    );
  }
}
