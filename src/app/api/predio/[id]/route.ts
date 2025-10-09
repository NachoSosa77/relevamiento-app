/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const {
      situacion,
      otra_situacion,
      situacion_juicio,
      observaciones,
      edificio_no_escolar_privado, // por si más adelante lo usás
    } = body;

    const fields: string[] = [];
    const values: any[] = [];

    if (body.hasOwnProperty("situacion")) {
      fields.push("situacion = ?");
      values.push(situacion ?? null);
    }
    if (body.hasOwnProperty("otra_situacion")) {
      fields.push("otra_situacion = ?");
      values.push(otra_situacion ?? null);
    }
    if (body.hasOwnProperty("situacion_juicio")) {
      fields.push("situacion_juicio = ?");
      values.push(situacion_juicio ?? null);
    }
    if (body.hasOwnProperty("observaciones")) {
      fields.push("observaciones = ?");
      values.push(observaciones ?? null);
    }
    if (body.hasOwnProperty("edificio_no_escolar_privado")) {
      fields.push("edificio_no_escolar_privado = ?");
      values.push(edificio_no_escolar_privado ?? null);
    }

    if (!fields.length) {
      return NextResponse.json(
        { message: "No hay campos para actualizar" },
        { status: 400 }
      );
    }

    const sql = `UPDATE predio SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result]: any = await pool.execute(sql, values);
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ updated: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error actualizando predio:", error);
    return NextResponse.json(
      { message: "Error actualizando predio", error: error.message },
      { status: 500 }
    );
  }
}
