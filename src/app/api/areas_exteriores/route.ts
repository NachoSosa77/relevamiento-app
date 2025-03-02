/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface AreaExterior extends RowDataPacket {
  id?: number;
  identificacion_plano: string;
  tipo: string;
  superficie: number;
  estado_conservacion: string;
  terminacion_piso: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const opciones = searchParams.get("opciones") === "true";

  try {
    const connection = await getConnection();
    let query = "SELECT * FROM areas_exteriores";
    const values: string[] = [];

    if (id) {
      query += " WHERE id = ?";
      values.push(id);
    }

    if (opciones) {
      query = "SELECT * FROM opciones_areas_exteriores";
    }

    const [result] = await connection.query<AreaExterior[]>(query, values);
    connection.release();

    if (id && result.length === 0) {
      return NextResponse.json(
        { message: "Área exterior no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error al obtener las áreas exteriores:", err);
    return NextResponse.json(
      { message: "Error al obtener las áreas exteriores", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data: AreaExterior = await req.json();
    const {
      identificacion_plano,
      tipo,
      superficie,
      estado_conservacion,
      terminacion_piso,
    } = data;

    await connection.query(
      "INSERT INTO areas_exteriores (identificacion_plano, tipo, superficie, estado_conservacion, terminacion_piso) VALUES (?, ?, ?, ?, ?)",
      [
        identificacion_plano,
        tipo,
        superficie,
        estado_conservacion,
        terminacion_piso,
      ]
    );
    connection.release();

    return NextResponse.json(
      { message: "Datos de área exterior insertados correctamente" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error al insertar datos del área exterior:", err);
    return NextResponse.json(
      {
        message: "Error al insertar datos del área exterior",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
