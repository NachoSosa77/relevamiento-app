/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { ids, urls } = body;

    if (!ids?.length || !urls?.length || ids.length !== urls.length) {
      return NextResponse.json(
        { error: "Parámetros inválidos: ids y urls son requeridos" },
        { status: 400 }
      );
    }

    // 1. Borrar de Vercel Blob en lote
    try {
      await del(urls); // del acepta array de URLs
    } catch (err) {
      console.error("❌ Error al borrar de Vercel Blob:", err);
      return NextResponse.json(
        { error: "Error al borrar archivos en Vercel Blob" },
        { status: 500 }
      );
    }

    // 2. Borrar de la base de datos
    const placeholders = ids.map(() => "?").join(",");
    await pool.execute(
      `DELETE FROM archivos WHERE id IN (${placeholders})`,
      ids
    );

    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (err: any) {
    console.error("❌ Error al borrar archivos:", err);
    return NextResponse.json(
      { error: err.message || "Error desconocido" },
      { status: 500 }
    );
  }
}
