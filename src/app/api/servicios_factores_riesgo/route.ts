import { pool } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let connection; // importante para poder liberar la conexión
  try {
    const body = await req.json();

    const factoresRiesgo = body;

    if (!Array.isArray(factoresRiesgo)) {
      return NextResponse.json({
        success: false,
        error:
          "Formato inválido, se esperaba un array de factores de riesgo ambiental.",
      });
    }

    const factoresValidos = factoresRiesgo.filter((f) => {
      return f.id_servicio && f.relevamiento_id;
    });

    if (factoresValidos.length !== factoresRiesgo.length) {
      return NextResponse.json({
        success: false,
        error: "Algunos factores de riesgo ambiental tienen campos faltantes.",
      });
    }

    // ✅ Obtener conexión del pool
    connection = await pool.getConnection();

    // ✅ Iniciar transacción
    await connection.beginTransaction();

    const query = `
      INSERT INTO factores_riesgo_ambiental
      (id_servicio, riesgo, respuesta, mitigacion, descripcion, descripcion_otro, relevamiento_id)
      VALUES ?
    `;

    const data = factoresValidos.map((f) => [
      f.id_servicio,
      f.riesgo || null,
      f.respuesta || null,
      f.mitigacion || null,
      f.descripcion || null,
      f.descripcion_otro || null, // 👈 Ojo: aquí debe coincidir con el nombre en la DB
      f.relevamiento_id,
    ]);

    await connection.query<ResultSetHeader>(query, [data]);

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error insertando factores de riesgo ambiental:", error);
    if (connection) await connection.rollback();
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release(); // ✅ Liberar conexión
  }
}
