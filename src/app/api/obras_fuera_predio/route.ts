/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

interface OpcionObraEnpredio extends RowDataPacket {
  id: number;
  name: string;
  prefijo: string;
}

export async function GET() {
  try {
    const connection = await getConnection();
    const [opciones] = await connection.query<OpcionObraEnpredio[]>(
      "SELECT * FROM obras_fuera_predio"
    );
    connection.release();

    return NextResponse.json(opciones);
  } catch (err: any) {
    console.error("Error al obtener las obras en predio:", err);
    return NextResponse.json(
      {
        message: "Error al obtener las obras en predio",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

// ✅ Método POST: Insertar una nueva obra en el predio
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Obtener datos del request
    const { tipo_obra, domicilio, cue, destino } = body;

    // 🔍 Validar que los campos requeridos estén presentes
    if (!tipo_obra || !domicilio || !destino) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO obras_fuera_predio (tipo_obra, domicilio, cue, destino) 
       VALUES (?, ?, ?, JSON_ARRAY(?))`,
      [tipo_obra, domicilio, cue, destino]
    );
    connection.release();

    return NextResponse.json(
      { message: "Obra creada correctamente", id: result.insertId },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error al insertar obra en predio:", err);
    return NextResponse.json(
      { message: "Error al insertar obra en predio", error: err.message },
      { status: 500 }
    );
  }
}
