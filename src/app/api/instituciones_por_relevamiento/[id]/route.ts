/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: relevamiento_id } = await params;

  if (!relevamiento_id) {
    return NextResponse.json(
      { message: "Falta el parámetro relevamiento_id" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query(
      `SELECT i.id,
  i.institucion,
  i.cui,
  i.cue,
  i.modalidad_nivel,
  i.localidad,
  i.provincia,
  i.calle,
  i.departamento,
  i.matricula  
   FROM instituciones i
   JOIN instituciones_por_relevamiento ipr ON i.id = ipr.institucion_id
   WHERE ipr.relevamiento_id = ?`,
      [relevamiento_id]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error al obtener instituciones:", error);
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
