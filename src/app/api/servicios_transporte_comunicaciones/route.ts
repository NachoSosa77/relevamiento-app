// app/api/servicios_transporte_comunicaciones/route.ts

import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

// Método POST
export async function POST(req: NextRequest) {
  const connection = await getConnection();

  try {
    const body = await req.json();

    const serviciosTransporte = body; // Los datos enviados

    if (!Array.isArray(serviciosTransporte)) {
      console.error("❌ Formato inválido, no es un array.");
      return NextResponse.json({
        success: false,
        error:
          "Formato inválido, se esperaba un array de servicios transporte.",
      });
    }

    const serviciosValidos = serviciosTransporte.filter((s) => {
      return (
        s.id_servicio && s.servicio && s.relevamiento_id // Verificación básica
      );
    });

    if (serviciosValidos.length !== serviciosTransporte.length) {
      console.warn("❌ Algunos servicios transporte tienen campos faltantes.");
      return NextResponse.json({
        success: false,
        error: "Algunos servicios transporte tienen campos faltantes.",
      });
    }

    await connection.beginTransaction();

    const query = `
      INSERT INTO servicios_transporte_comunicaciones
      (id_servicio, servicio, disponibilidad, distancia, en_predio , relevamiento_id)
      VALUES ?
    `;

    const data = serviciosValidos.map((s) => [
      s.id_servicio,
      s.servicio,
      s.disponibilidad || null,
      s.distancia || null,
      s.en_predio || null,
      s.relevamiento_id,
    ]);

    await connection.query<ResultSetHeader>(query, [data]);

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error insertando servicios transporte:", error);
    return NextResponse.json({ success: false, error });
  } finally {
    connection.release();
  }
}
