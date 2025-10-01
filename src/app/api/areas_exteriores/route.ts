/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
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
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: "Se esperaba un array de áreas exteriores" },
        { status: 400 }
      );
    }

    const insertResults = [];

    for (const area of body) {
      // Validar duplicado
      const [existingAreas] = await pool.query<AreaExterior[]>(
        `SELECT * FROM areas_exteriores WHERE relevamiento_id = ? AND identificacion_plano = ?`,
        [area.relevamiento_id, area.identificacion_plano]
      );

      if (existingAreas.length > 0) {
        return NextResponse.json(
          {
            message: `Ya existe un área con identificación "${area.identificacion_plano}" para este relevamiento.`,
          },
          { status: 409 }
        );
      }

      // Si no existe, insertar
      const [result] = await pool.query<ResultSetHeader>(
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
    const relevamientoId = req.url.split("/").pop(); // Obtener el último segmento de la URL como relevamientoId

    let query = "SELECT * FROM areas_exteriores";
    const params: any[] = [];

    if (relevamientoId) {
      query += " WHERE relevamiento_id = ?";
      params.push(Number(relevamientoId));
    }

    const [areasExteriores] = await pool.query<AreaExterior[]>(query, params);

    return NextResponse.json({ areasExteriores });
  } catch (err: any) {
    console.error("Error al obtener las áreas externas:", err);
    return NextResponse.json(
      { message: "Error al obtener las áreas externas", error: err.message },
      { status: 500 }
    );
  }
}
