/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const connection = await getConnection();
  const { id: relevamiento_id } = await params;

  if (!relevamiento_id) {
    return NextResponse.json(
      { message: "Falta el parámetro relevamiento_id" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await connection.query(
      `SELECT i.id,
  i.institucion AS nombre,
  i.cui,
  i.cue,
  i.modalidad_nivel,
  i.localidad
   FROM instituciones i
   JOIN instituciones_por_relevamiento ipr ON i.id = ipr.institucion_id
   WHERE ipr.relevamiento_id = ?`,
      [relevamiento_id]
    );

    connection.release();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error al obtener instituciones:", error);
    connection.release();
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
