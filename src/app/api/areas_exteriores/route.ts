/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface AreaExterior extends RowDataPacket {
  id?: number; // El 'id' ahora es opcional
  cui_number?: number;
  relevamiento_id?: number;
  identificacion_plano: string;
  tipo: string;
  superficie: string;
  estado_conservacion?: string;
  terminacion_piso?: string;
}

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: "Se esperaba un array de áreas exteriores" },
        { status: 400 }
      );
    }

    const insertResults = [];

    for (const area of body) {
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO areas_exteriores (cui_number, relevamiento_id, identificacion_plano, tipo, superficie) VALUES (?, ?, ?, ?, ?)`,
        [
          area.cui_number,
          area.relevamiento_id,
          area.identificacion_plano,
          area.tipo,
          area.superficie,
        ]
      );
      insertResults.push({ id: result.insertId, ...area });
    }

    connection.release();

    return NextResponse.json({
      message: "Áreas exteriores guardadas correctamente",
      inserted: insertResults,
    });
  } catch (err: any) {
    console.error("Error al crear áreas exteriores:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const connection = await getConnection();
    const relevamientoId = req.url.split("/").pop(); // Obtener el último segmento de la URL como relevamientoId

    let query = "SELECT * FROM areas_exteriores";
    const params: any[] = [];

    if (relevamientoId) {
      query += " WHERE relevamiento_id = ?";
      params.push(Number(relevamientoId));
    }

    const [areasExteriores] = await connection.query<AreaExterior[]>(
      query,
      params
    );
    connection.release();

    return NextResponse.json({ areasExteriores });
  } catch (err: any) {
    console.error("Error al obtener las áreas externas:", err);
    return NextResponse.json(
      { message: "Error al obtener las áreas externas", error: err.message },
      { status: 500 }
    );
  }
}
