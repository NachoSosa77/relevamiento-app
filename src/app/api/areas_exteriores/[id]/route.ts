/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await req.json(); // 👀 Leer el cuerpo de la petición

    if (!id) {
      return NextResponse.json(
        { message: "ID no proporcionado" },
        { status: 400 }
      );
    }

    // ✅ Actualizar la base de datos
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE areas_exteriores 
   SET identificacion_plano = ?, superficie = ?, terminacion_piso = ?, estado_conservacion = ?, tipo = ?, predio_id = ?
   WHERE id = ?`,
      [
        body.identificacion_plano,
        body.superficie,
        body.terminacion_piso,
        body.estado_conservacion,
        body.tipo,
        body.predio_id, // <-- este lo sumás
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se encontró el área exterior para actualizar" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Área exterior actualizada correctamente",
    });
  } catch (err: any) {
    console.error("Error al actualizar el área exterior:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID no proporcionado" },
        { status: 400 }
      );
    }

    // Construir consulta dinámica para solo los campos enviados
    const fields = [];
    const values = [];

    const allowedFields = [
      "identificacion_plano",
      "superficie",
      "tipo",
      "terminacion_piso", // <-- agregá este
      "estado_conservacion", // <-- y este
    ];

    for (const key of allowedFields) {
      if (key in body) {
        fields.push(`${key} = ?`);
        values.push(body[key]);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { message: "No hay campos para actualizar" },
        { status: 400 }
      );
    }

    values.push(id);

    const query = `UPDATE areas_exteriores SET ${fields.join(
      ", "
    )} WHERE id = ?`;

    const [result] = await pool.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se encontró el área exterior para actualizar" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Área exterior actualizada correctamente (PATCH)",
    });
  } catch (err: any) {
    console.error("Error al hacer PATCH al área exterior:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
