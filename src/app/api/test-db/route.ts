import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("📡 Probando conexión a la base de datos...");
    const connection = await getConnection();
    console.log("✅ Conectado a la base de datos.");

    const [rows] = await connection.query("SELECT 1+1 AS result");
    console.log("🔎 Resultado de la prueba:", rows);

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
