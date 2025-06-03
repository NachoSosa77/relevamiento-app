// app/api/servicios_basicos/route.ts

import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const connection = await getConnection();

  try {
    const body = await req.json();

    const serviciosBasicos = body; // No hay "serviciosBasicos" dentro del body, es directo

    if (!Array.isArray(serviciosBasicos)) {
      console.error("❌ Formato inválido, no es un array.");
      return NextResponse.json({
        success: false,
        error: "Formato inválido, se esperaba un array de servicios básicos.",
      });
    }

    const serviciosValidos = serviciosBasicos.filter((s) => {
      return s.id_servicio && s.servicio && s.relevamiento_id; // Verificación corregida para los nombres de los campos
    });

    if (serviciosValidos.length !== serviciosBasicos.length) {
      console.warn("❌ Algunos servicios básicos tienen campos faltantes.");
      return NextResponse.json({
        success: false,
        error: "Algunos servicios básicos tienen campos faltantes.",
      });
    }

    await connection.beginTransaction();

    const query = `
      INSERT INTO servicios_basicos_predio 
      (id_servicio, servicio, disponibilidad, distancia, en_predio, prestadores, relevamiento_id)
      VALUES ?
    `;

    const data = serviciosValidos.map((s) => [
      s.id_servicio || "DEFAULT_ID", // Reemplazar valores vacíos con un valor por defecto si es necesario
      s.servicio || "DEFAULT_SERVICIO", // Asegurar que siempre haya un valor
      s.disponibilidad || null,
      s.distancia || null,
      s.en_predio || "No especificado", // Evitar cadenas vacías
      s.prestadores || null,
      s.relevamiento_id,
    ]);

    await connection.query<ResultSetHeader>(query, [data]);

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error insertando servicios básicos:", error);
    return NextResponse.json({ success: false, error });
  } finally {
    connection.release();
  }
}
