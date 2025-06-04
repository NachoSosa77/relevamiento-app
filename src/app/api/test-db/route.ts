import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await getConnection();

    const [rows] = await connection.query("SELECT 1+1 AS result");

    connection.release();
    return NextResponse.json({ message: "Conexión exitosa", data: rows });
  } catch (error) {
    console.error("❌ Error en la conexión:", error);
    return NextResponse.json(
      { message: "Error en la conexión", error },
      { status: 500 }
    );
  }
}
