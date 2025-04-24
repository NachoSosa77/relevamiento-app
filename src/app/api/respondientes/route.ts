// app/api/respondientes/route.ts

import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const connection = await getConnection();

  try {
    const body = await req.json();

    console.log("✅ Datos recibidos en el endpoint:", body);

    const respondientes = body.respondientes;

    if (!Array.isArray(respondientes)) {
      console.error("❌ Formato inválido, no es un array.");
      return NextResponse.json({
        success: false,
        error: "Formato inválido, se esperaba un array de respondientes.",
      });
    }

    const respondientesValidos = respondientes.filter((r) => {
      return (
        r.nombre_completo &&
        r.cargo &&
        r.establecimiento &&
        r.telefono &&
        r.relevamiento_id
      );
    });

    if (respondientesValidos.length !== respondientes.length) {
      console.warn("❌ Algunos respondientes tienen campos faltantes.");
      return NextResponse.json({
        success: false,
        error: "Algunos respondientes tienen campos faltantes.",
      });
    }

    await connection.beginTransaction();

    const query = `
      INSERT INTO respondientes (nombre_completo, cargo, establecimiento, telefono, relevamiento_id)
      VALUES ?
    `;

    const data = respondientesValidos.map((r) => [
      r.nombre_completo,
      r.cargo,
      r.establecimiento,
      r.telefono,
      r.relevamiento_id,
    ]);

    await connection.query<ResultSetHeader>(query, [data]);

    await connection.commit();
    console.log("✅ Respondientes insertados correctamente");
    return NextResponse.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error insertando respondientes:", error);
    return NextResponse.json({ success: false, error });
  } finally {
    connection.release();
    console.log("🔚 Conexión liberada");
  }
}
