/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

// POST: crear construcción
export async function POST(req: Request) {
  try {
    const body = await req.json();
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

    // 🔒 Verificación de duplicado
    const [existing] = await pool.query(
      `SELECT id FROM construcciones WHERE relevamiento_id = ? AND numero_construccion = ?`,
      [relevamiento_id, numero_construccion]
    );

    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        {
          message:
            "Ya existe una construcción con ese número para este relevamiento",
        },
        { status: 409 }
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
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

  if (!relevamientoId || isNaN(Number(relevamientoId))) {
    return NextResponse.json(
      { message: "Parámetro relevamiento_id inválido o faltante" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM construcciones WHERE relevamiento_id = ? ORDER BY numero_construccion ASC`,
      [relevamientoId]
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    console.error("Error al obtener construcciones:", err);
    return NextResponse.json(
      { message: "Error al obtener construcciones", error: err.message },
      { status: 500 }
    );
  }
}
