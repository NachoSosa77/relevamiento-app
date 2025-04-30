/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Obtener datos del request
    const { relevamiento_id, numero_construccion, antiguedad, destino } = body;
    console.log(body); // Para ver qué datos llegan

    // 🔍 Validar que los campos requeridos estén presentes
    if (!relevamiento_id || !numero_construccion || !antiguedad || !destino) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO construcciones (relevamiento_id, numero_construccion, antiguedad, destino) 
       VALUES (?, ?, ?, ?)`,
      [relevamiento_id, numero_construccion, antiguedad, destino]
    );
    connection.release();

    // Devolvemos el ID de la construcción creada
    return NextResponse.json(
      { message: "Construcción creada correctamente", id: result.insertId },
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
