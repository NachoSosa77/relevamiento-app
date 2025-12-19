// app/api/relevamientos/[id]/construcciones/route.ts
import { pool } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const relevamientoId = Number(id);
  if (!Number.isFinite(relevamientoId) || relevamientoId <= 0) {
    return NextResponse.json({ message: "id inválido" }, { status: 400 });
  }

  const [rows]: any[] = await pool.query(
    `SELECT id, numero_construccion
       FROM construcciones
      WHERE relevamiento_id = ?
      ORDER BY COALESCE(numero_construccion, 999999), id`,
    [relevamientoId]
  );

  return NextResponse.json({ items: rows || [] }, { status: 200 });
}
