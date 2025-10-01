// app/api/factores_riesgo_ambiental/route.ts

import { pool } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

// Método POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const factoresRiesgo = body; // Datos enviados

    if (!Array.isArray(factoresRiesgo)) {
      console.error("❌ Formato inválido, no es un array.");
      return NextResponse.json({
        success: false,
        error:
          "Formato inválido, se esperaba un array de factores de riesgo ambiental.",
      });
    }

    const factoresValidos = factoresRiesgo.filter((f) => {
      return (
        f.id_servicio && f.relevamiento_id // Verificación mínima
      );
    });

    if (factoresValidos.length !== factoresRiesgo.length) {
      console.warn("❌ Algunos factores tienen campos faltantes.");
      return NextResponse.json({
        success: false,
        error: "Algunos factores de riesgo ambiental tienen campos faltantes.",
      });
    }

    await pool.beginTransaction();

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
      f.descripcionOtro || null,
      f.relevamiento_id,
    ]);

    await pool.query<ResultSetHeader>(query, [data]);

    await pool.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await pool.rollback();
    console.error("❌ Error insertando factores de riesgo ambiental:", error);
    return NextResponse.json({ success: false, error });
  } finally {
  }
}
