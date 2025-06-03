/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/visitas/route.ts

import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const connection = await getConnection();

  try {
    const visitas = await req.json();

    if (!Array.isArray(visitas)) {
      console.error("❌ Formato inválido, no es un array.");
      return NextResponse.json({
        success: false,
        error: "Formato inválido, se esperaba un array de visitas.",
      });
    }

    // Validamos que cada visita tenga los datos necesarios
    const visitasValidas = visitas.filter((visita) => {
      return (
        visita.numero_visita &&
        visita.fecha &&
        visita.hora_inicio &&
        visita.hora_finalizacion &&
        visita.relevamiento_id
      );
    });

    if (visitasValidas.length !== visitas.length) {
      console.warn("Algunas visitas tienen campos faltantes.");
      return NextResponse.json({
        success: false,
        error: "Algunas visitas tienen campos faltantes.",
      });
    }

    // Usamos una transacción para insertar todas las visitas de manera segura
    await connection.beginTransaction();

    const query = `
      INSERT INTO visitas_realizadas (numero_visita, fecha, hora_inicio, hora_finalizacion, observaciones, relevamiento_id)
      VALUES ?
    `;

    const visitasData = visitasValidas.map((visita) => [
      visita.numero_visita,
      visita.fecha,
      visita.hora_inicio,
      visita.hora_finalizacion,
      visita.observaciones || "",
      visita.relevamiento_id,
    ]);

    const resultado = await connection.query<ResultSetHeader>(query, [
      visitasData,
    ]);

    // Confirmamos la transacción
    await connection.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error insertando visitas, rollback ejecutado:", error);
    return NextResponse.json({ success: false, error: error });
  } finally {
    connection.release();
  }
}
