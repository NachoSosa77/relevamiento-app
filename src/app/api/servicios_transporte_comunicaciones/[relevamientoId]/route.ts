/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface ServicioTransporte extends RowDataPacket {
  id: number;
  id_servicio: string;
  servicio: string;
  en_predio: string | null;
  disponibilidad: string | null;
  distancia: string | null;
  relevamiento_id: number;
  created_at: string;
  updated_at: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  try {
    const connection = await getConnection();
    const relevamientoId = (await params).relevamientoId;

    if (!relevamientoId) {
      return NextResponse.json(
        { message: "Falta el parámetro relevamientoId" },
        { status: 400 }
      );
    }

    const [servicios] = await connection.query<ServicioTransporte[]>(
      "SELECT * FROM servicios_transporte_comunicaciones WHERE relevamiento_id = ?",
      [Number(relevamientoId)]
    );

    connection.release();

    return NextResponse.json({ servicios });
  } catch (err: any) {
    console.error("Error al obtener servicios transporte:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  try {
    const connection = await getConnection();
    const relevamientoId = (await params).relevamientoId;

    if (!relevamientoId) {
      return NextResponse.json(
        { message: "Falta el parámetro relevamientoId" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const servicios = body.serviciosTransporte;

    if (!Array.isArray(servicios) || servicios.length === 0) {
      return NextResponse.json(
        { message: "No se recibieron servicios para actualizar" },
        { status: 400 }
      );
    }

    // Actualizamos cada registro por su ID
    for (const s of servicios) {
      const { id, en_predio, disponibilidad, distancia } = s;
      await connection.query(
        `UPDATE servicios_transporte_comunicaciones
         SET en_predio = ?, disponibilidad = ?, distancia = ?
         WHERE id = ? AND relevamiento_id = ?`,
        [
          en_predio ?? null,
          disponibilidad ?? null,
          distancia ?? null,
          id,
          relevamientoId,
        ]
      );
    }

    connection.release();
    return NextResponse.json({
      message: "Servicios actualizados correctamente!",
    });
  } catch (err: any) {
    console.error("Error al actualizar servicios transporte:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
