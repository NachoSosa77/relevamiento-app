/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

interface AntiguedadConstruccion extends RowDataPacket {
  id: number;
  ano: string;
  destino: string;
}

export async function GET() {
  try {
    const connection = await getConnection();
    const [opciones] = await connection.query<AntiguedadConstruccion[]>(
      "SELECT * FROM antiguedad_construccion"
    );
    connection.release();

    return NextResponse.json(opciones);
  } catch (err: any) {
    console.error("Error al obtener los datos de la construcción:", err);
    return NextResponse.json(
      {
        message: "Error al obtener los datos de la construcción:",
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
    const { ano, destino } = body;

    // 🔍 Validar que los campos requeridos estén presentes
    if (!ano || !destino) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO antiguedad_construccion (ano, destino) 
       VALUES (?, ?)`,
      [ano, destino]
    );
    connection.release();

    return NextResponse.json(
      { message: "Datos enviados correctamente", id: result.insertId },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error al insertar los datos de la construcción:", err);
    return NextResponse.json(
      {
        message: "Error al insertar los datos de la construcción:",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
