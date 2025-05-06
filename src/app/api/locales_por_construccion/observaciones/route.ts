// app/api/relevamiento/observaciones/route.ts

import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const connection = await getConnection();
    const { localId, observaciones } = await req.json();

    if (!localId || typeof observaciones !== "string") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    await connection.execute(
      `UPDATE locales_por_construccion SET observaciones = ? WHERE id = ?`,
      [observaciones, localId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error guardando observaciones:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
