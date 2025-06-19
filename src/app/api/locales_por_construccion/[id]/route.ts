/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface LocalPorConstruccion extends RowDataPacket {
  id?: number;
  construccion_id?: number;
  identificacion_plano: number;
  numero_planta: number;
  tipo: string;
  local_id: number;
  local_sin_uso: string;
  superficie?: number;
  tipo_superficie: string;
  cui_number?: number;
  relevamiento_id?: number;
  largo_predominante?: number;
  ancho_predominante?: number;
  altura_maxima?: number;
  altura_minima?: number;
  proteccion_contra_robo?: string;
  observaciones?: string;
  estado?: string;
  numero_construccion?: number;
  nombre_local?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const connection = await getConnection();
    const { id } = await params; // Aquí desestructuramos el id

    const idNumber = Number(id); // Convertir el id a número

    if (isNaN(idNumber)) {
      return NextResponse.json(
        { message: "El ID no es válido." },
        { status: 400 }
      );
    }

    const [rows] = await connection.query<LocalPorConstruccion[]>(
      `
      SELECT 
        lpc.*,
        loc.name AS nombre_local,
        loc.tipo
      FROM locales_por_construccion lpc
      JOIN opciones_locales loc ON lpc.local_id = loc.id
      WHERE lpc.id = ?
      `,
      [idNumber]
    );

    connection.release();

    const local = rows[0]; // ✅ Obtenemos el primer elemento

    // Verificar si se encontró el local
    if (local.length === 0) {
      return NextResponse.json(
        { message: "Local no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ local });
  } catch (err: any) {
    console.error("Error al obtener el local:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar campos por ID escalable
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id || isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    // Lista blanca de campos que se pueden actualizar
    const allowedFields = ["destino_original", "proteccion_contra_robo"];
    const fieldsToUpdate = Object.entries(body).filter(([key]) =>
      allowedFields.includes(key)
    );

    if (fieldsToUpdate.length === 0) {
      return NextResponse.json(
        { message: "No se enviaron campos válidos para actualizar" },
        { status: 400 }
      );
    }

    const setClause = fieldsToUpdate.map(([key]) => `${key} = ?`).join(", ");
    const values = fieldsToUpdate.map(([, value]) => value);

    const connection = await getConnection();

    const [result] = await connection.query(
      `UPDATE locales_por_construccion SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    connection.release();

    return NextResponse.json({
      message: "Actualización exitosa",
      result,
    });
  } catch (err: any) {
    console.error("❌ Error al actualizar el local:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const body = await request.json();

  const {
    largo_predominante,
    ancho_predominante,
    diametro,
    altura_maxima,
    altura_minima,
  } = body;

  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      `UPDATE locales_por_construccion 
       SET largo_predominante = ?, 
           ancho_predominante = ?, 
           diametro = ?, 
           altura_maxima = ?, 
           altura_minima = ?
       WHERE id = ?`,
      [
        largo_predominante,
        ancho_predominante,
        diametro,
        altura_maxima,
        altura_minima,
        id,
      ]
    );

    connection.release();

    return NextResponse.json({ success: true, updated: result });
  } catch (error) {
    console.error("Error al actualizar dimensiones:", error);
    return new NextResponse("Error al actualizar", { status: 500 });
  }
}
