/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

// Asegurate de que estos campos coincidan con los reales de tu tabla
interface ObraFueraPredio extends RowDataPacket {
  id: number;
  tipo_obra: string;
  domicilio: string;
  cue: string | null;
  destino: string;
  relevamiento_id: number;
}

export async function GET() {
  try {
    const connection = await getConnection();
    const [obras] = await connection.query<ObraFueraPredio[]>(
      "SELECT * FROM obras_fuera_predio"
    );
    connection.release();

    return NextResponse.json(obras);
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { tipo_obra, domicilio, cue, destino, relevamiento_id } = body;

    if (!tipo_obra || !domicilio || !destino || !relevamiento_id) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO obras_fuera_predio 
      (tipo_obra, domicilio, cue, destino, relevamiento_id) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        tipo_obra,
        domicilio,
        cue ?? null, // Si cue no es obligatorio, permitir null
        JSON.stringify(destino),
        relevamiento_id,
      ]
    );
    connection.release();

    return NextResponse.json(
      { message: "Obra creada correctamente", id: result.insertId },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("🔴 Error al insertar obra en predio:", err);
    return NextResponse.json(
      { message: "Error al insertar obra en predio", error: err.message },
      { status: 500 }
    );
  }
}
