/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

// POST: crear construcción
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY RECIBIDO:", body);
    const {
      relevamiento_id,
      numero_construccion,
      superficie_cubierta,
      superficie_semicubierta,
      superficie_total,
    } = body;

    if (
      relevamiento_id === undefined ||
      numero_construccion === undefined ||
      superficie_cubierta === undefined ||
      superficie_semicubierta === undefined ||
      superficie_total === undefined
    ) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO construcciones (
        relevamiento_id,
        numero_construccion,
        superficie_cubierta,
        superficie_semicubierta,
        superficie_total
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        relevamiento_id,
        numero_construccion,
        superficie_cubierta,
        superficie_semicubierta,
        superficie_total,
      ]
    );

    connection.release();

    return NextResponse.json(
      {
        message: "Construcción creada correctamente",
        construccion_id: result.insertId,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error al insertar los datos de la construcción:", err);
    return NextResponse.json(
      {
        message: "Error al insertar los datos de la construcción",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

// GET: obtener construcción por relevamiento_id y numero_construccion
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const relevamientoId = searchParams.get("relevamiento_id");
  const numeroConstruccion = searchParams.get("numero");

  if (!relevamientoId || !numeroConstruccion) {
    return NextResponse.json(
      { message: "Faltan parámetros: relevamiento_id o numero" },
      { status: 400 }
    );
  }

  try {
    const connection = await getConnection();

    const [rows] = await connection.query(
      `SELECT * FROM construcciones 
       WHERE relevamiento_id = ? AND numero_construccion = ?`,
      [relevamientoId, numeroConstruccion]
    );

    connection.release();

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json(
        { message: "Construcción no encontrada" },
        { status: 404 }
      );
    }
  } catch (err: any) {
    console.error("Error al obtener construcción:", err);
    return NextResponse.json(
      { message: "Error al obtener construcción", error: err.message },
      { status: 500 }
    );
  }
}
