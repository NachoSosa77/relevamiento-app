/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/construcciones/[id]/route.ts
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = await getConnection();

    // Obtenemos la construcción por id
    const [rows] = await connection.query(
      "SELECT * FROM construcciones WHERE id = ? LIMIT 1",
      [id]
    );
    connection.release();

    const construccion =
      Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!construccion) {
      return NextResponse.json(
        { message: "Construcción no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(construccion, { status: 200 });
  } catch (err: any) {
    console.error("Error al obtener la construcción:", err);
    return NextResponse.json(
      { message: "Error en el servidor", error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      antiguedad,
      destino,
      observaciones,
      numero_construccion,
      superficie_cubierta,
      superficie_semicubierta,
      superficie_total,
      relevamiento_id,
    } = body;

    const connection = await getConnection();

    const fields: string[] = [];
    const values: any[] = [];

    if (antiguedad !== undefined) {
      fields.push("antiguedad = ?");
      values.push(antiguedad);
    }

    if (destino !== undefined) {
      fields.push("destino = ?");
      values.push(destino);
    }

    if (observaciones !== undefined) {
      fields.push("observaciones = ?");
      values.push(observaciones);
    }

    if (numero_construccion !== undefined) {
      fields.push("numero_construccion = ?");
      values.push(numero_construccion);
    }

    if (superficie_cubierta !== undefined) {
      fields.push("superficie_cubierta = ?");
      values.push(superficie_cubierta);
    }

    if (superficie_semicubierta !== undefined) {
      fields.push("superficie_semicubierta = ?");
      values.push(superficie_semicubierta);
    }

    if (superficie_total !== undefined) {
      fields.push("superficie_total = ?");
      values.push(superficie_total);
    }

    if (relevamiento_id !== undefined) {
      fields.push("relevamiento_id = ?");
      values.push(relevamiento_id);
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { message: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      );
    }

    values.push(id);

    const query = `
      UPDATE construcciones
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    await connection.query(query, values);
    connection.release();

    return NextResponse.json(
      { message: "Construcción actualizada correctamente" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error al actualizar la construcción:", err);
    return NextResponse.json(
      { message: "Error en el servidor", error: err.message },
      { status: 500 }
    );
  }
}
