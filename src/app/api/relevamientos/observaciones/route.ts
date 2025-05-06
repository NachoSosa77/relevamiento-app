// app/api/relevamiento/observaciones/route.ts

import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const connection = await getConnection();
    const { relevamientoId, observaciones } = await req.json();

    if (!relevamientoId || typeof observaciones !== "string") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    await connection.execute(
      `UPDATE relevamientos SET construcciones_observaciones = ? WHERE id = ?`,
      [observaciones, relevamientoId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error guardando observaciones:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
