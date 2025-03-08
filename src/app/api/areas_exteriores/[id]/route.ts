/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const connection = await getConnection();
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { message: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const [result] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM areas_exteriores WHERE id = ?",
      [id]
    );
    connection.release();

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Área exterior no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]); // ✅ Devolver solo un objeto en lugar de un array
  } catch (err: any) {
    console.error("Error al obtener el área exterior:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const connection = await getConnection();
    const id = (await params).id;
    const body = await req.json(); // 👀 Leer el cuerpo de la petición

    if (!id) {
      return NextResponse.json(
        { message: "ID no proporcionado" },
        { status: 400 }
      );
    }

    // ✅ Actualizar la base de datos
    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE areas_exteriores 
       SET identificacion_plano = ?, superficie = ?, terminacion_piso = ?, estado_conservacion = ?, tipo = ?
       WHERE id = ?`,
      [
        body.identificacion_plano,
        body.superficie,
        body.terminacion_piso,
        body.estado_conservacion,
        body.tipo,
        id,
      ]
    );

    connection.release();

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
