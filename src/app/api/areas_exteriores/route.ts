/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface AreaExterior extends RowDataPacket {
  id?: number; // El 'id' ahora es opcional
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

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO areas_exteriores (identificacion_plano, tipo, superficie) VALUES (?, ?, ?)`,
      [body.identificacion_plano, body.tipo, body.superficie]
    );

    const areaExteriorId = result.insertId;

    connection.release();

    return NextResponse.json({
      message: "Área exterior creada correctamente",
      id: areaExteriorId,
    });
  } catch (err: any) {
    console.error("Error al crear el área exterior:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const connection = await getConnection();
    const query = "SELECT * FROM areas_exteriores"; // Consulta para traer todas las áreas externas

    const [areasExteriores] = await connection.query<AreaExterior[]>(query);
    connection.release();

    return NextResponse.json({ areasExteriores }); // Devuelve todas las áreas externas
  } catch (err: any) {
    console.error("Error al obtener las áreas externas:", err);
    return NextResponse.json(
      { message: "Error al obtener las áreas externas", error: err.message },
      { status: 500 }
    );
  }
}
