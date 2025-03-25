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
  context: { params: { id: string } }
) {
  const { params } = context; // Extrae params correctamente
  const { id } = params;

  // Valida que el id sea un número
  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { message: "ID no válido. Debe ser un número." },
      { status: 400 }
    );
  }

  try {
    const connection = await getConnection();
    const [instituciones] = await connection.query<Institucion[]>(
      "SELECT * FROM instituciones WHERE id = ?",
      [id]
    );
    connection.release();

    if (instituciones.length === 0) {
      return NextResponse.json(
        { message: "Institución no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(instituciones[0]); // Devuelve solo la institución encontrada
  } catch (err: any) {
    console.error("Error al obtener la institución:", err);
    return NextResponse.json(
      { message: "Error al obtener la institución", error: err.message },
      { status: 500 }
    );
  }
}
