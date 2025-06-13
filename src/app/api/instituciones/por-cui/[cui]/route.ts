/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Institucion extends RowDataPacket {
  departamento: string;
  localidad: string;
  modalidad_nivel: string;
  institucion: string;
  cue: number;
  cui: number;
  matricula: number;
  calle: string;
  calle_numero: string;
  referencia: string;
  provincia: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cui: string }> }
) {
  const cui = (await params).cui;

  try {
    const connection = await getConnection();

    // Query para obtener instituciones por cui
    const query = "SELECT * FROM instituciones WHERE cui = ?";
    const [instituciones] = await connection.query<Institucion[]>(query, [cui]);

    connection.release();

    if (!instituciones || instituciones.length === 0) {
      return NextResponse.json(
        { message: "Establecimiento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ instituciones });
  } catch (error: any) {
    console.error("Error al obtener las instituciones:", error);
    return NextResponse.json(
      { message: "Error al obtener las instituciones", error: error.message },
      { status: 500 }
    );
  }
}
