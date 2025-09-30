/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { OkPacket, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface ServiciosBasicos extends RowDataPacket {
  id: number;
  id_servicio: string;
  relevamiento_id: number;
  servicio: string;
  disponibilidad: string;
  distancia: string;
  en_predio: string;
  prestadores: string;
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

    const [serviciosBasicos] = await connection.query<ServiciosBasicos[]>(
      "SELECT * FROM servicios_basicos_predio WHERE relevamiento_id = ?",
      [Number(relevamientoId)]
    );

    connection.release();

    return NextResponse.json({ serviciosBasicos });
  } catch (err: any) {
    console.error("Error al obtener áreas exteriores:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const connection = await getConnection();
    const body = await req.json();

    const servicios = body.serviciosBasicos;

    if (!servicios || servicios.length === 0) {
      return NextResponse.json(
        { message: "No hay servicios para actualizar" },
        { status: 400 }
      );
    }

    // Hacemos update por cada servicio usando el id
    for (const s of servicios) {
      await connection.query<OkPacket>(
        `UPDATE servicios_basicos_predio 
         SET disponibilidad = ?, distancia = ?, en_predio = ?, prestadores = ?
         WHERE id = ?`,
        [
          s.disponibilidad ?? null,
          s.distancia ?? null,
          s.en_predio,
          s.prestadores ?? null,
          s.id,
        ]
      );
    }

    connection.release();
    return NextResponse.json({
      message: "Servicios actualizados correctamente",
    });
  } catch (err: any) {
    console.error("Error al actualizar servicios:", err);
    return NextResponse.json(
      { message: "Error interno", error: err.message },
      { status: 500 }
    );
  }
}
