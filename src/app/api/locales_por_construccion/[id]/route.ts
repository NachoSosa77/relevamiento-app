/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
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

// Campos permitidos para actualizar
const allowedFields = [
  "construccion_id",
  "identificacion_plano",
  "numero_planta",
  "tipo",
  "local_id",
  "local_sin_uso",
  "superficie",
  "tipo_superficie",
  "cui_number",
  "relevamiento_id",
  "largo_predominante",
  "ancho_predominante",
  "diametro",
  "altura_maxima",
  "altura_minima",
  "destino_original",
  "proteccion_contra_robo",
  "observaciones",
  "estado",
  "numero_construccion",
];

// Campos permitidos para actualizar en PUT
const allowedPutFields = ["destino_original", "proteccion_contra_robo"];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNumber = Number(id); // Convertir el id a número

    if (Number.isNaN(idNumber)) {
      return NextResponse.json(
        { message: "El ID no es válido." },
        { status: 400 }
      );
    }

    const [rows] = await pool.query<LocalPorConstruccion[]>(
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

    const local = rows[0];

    if (!local) {
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

// PUT - Actualizar campos por ID (solo algunos campos)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idNumber = Number(id);

  if (!id || Number.isNaN(idNumber)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();

  // Filtrar solo los campos permitidos
  const fields: string[] = [];
  const values: any[] = [];

  for (const key of allowedPutFields) {
    if (key in body && body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (fields.length === 0) {
    return NextResponse.json(
      { message: "No se enviaron campos válidos para actualizar" },
      { status: 400 }
    );
  }

  // último parámetro es el ID numérico
  values.push(idNumber);

  try {
    const [result] = await pool.query(
      `UPDATE locales_por_construccion SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      message: "Actualización exitosa",
      result,
    });
  } catch (err: any) {
    console.error("❌ Error al actualizar el local (PUT):", err);
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
  const { id } = await params;
  const idNumber = Number(id);

  if (!id || Number.isNaN(idNumber)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();

  // Filtrar solo campos válidos que vienen en body
  const fields: string[] = [];
  const values: any[] = [];

  for (const key of allowedFields) {
    if (key in body && body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (fields.length === 0) {
    return NextResponse.json(
      { message: "No hay campos válidos para actualizar" },
      { status: 400 }
    );
  }

  // último parámetro es el ID numérico
  values.push(idNumber);

  try {
    const [result] = await pool.query(
      `UPDATE locales_por_construccion SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      message: "Local actualizado correctamente",
      updated: result,
    });
  } catch (error: any) {
    console.error("Error al actualizar el local:", error);
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
