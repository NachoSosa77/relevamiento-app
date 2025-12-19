// app/api/relevamientos/[id]/route.ts
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
    `SELECT id, cui_id FROM relevamientos WHERE id = ? LIMIT 1`,
    [id]
  );

  if (!rows?.length)
    return NextResponse.json({ message: "No encontrado" }, { status: 404 });
  return NextResponse.json(rows[0], { status: 200 });
}
