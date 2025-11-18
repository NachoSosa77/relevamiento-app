/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db"; // <-- Usamos pool directamente
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface LocalPorConstruccion extends RowDataPacket {
  id: number;
  local_id: number;
  relevamiento_id: number;
  cui_number: number;
  numero_construccion: number;
  numero_planta: number;
  identificacion_plano: string;
  tipo: string;
  nombre_local: string;
  estado: string;
  largo_predominante?: number | null;
  ancho_predominante?: number | null;
  diametro?: number | null;
  altura_maxima?: number | null;
  altura_minima?: number | null;
  superficie?: number | null;
  tipo_superficie?: string | null; // "Cubierta", "Semicubierta", etc.
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ relevamientoId: string }> }
) {
  let relevamientoId: string | undefined; // Inicializamos o usamos undefined
  try {
    // Desestructuramos el ID del parámetro
    const awaitedParams = await params;
    relevamientoId = awaitedParams.relevamientoId;

    if (!relevamientoId) {
      return NextResponse.json(
        { message: "Falta el parámetro relevamientoId" },
        { status: 400 }
      );
    }

    // Convertimos a número fuera de la consulta para mejor claridad
    const idNumber = Number(relevamientoId);

    // ✅ Uso pool.query() directamente: más eficiente para Serverless,
    // gestiona la conexión y liberación automáticamente.
    const [localesPorRelevamiento] = await pool.query<LocalPorConstruccion[]>(
      `
    SELECT 
      lpc.id,
      lpc.local_id,
      lpc.relevamiento_id,
      lpc.cui_number,
      lpc.numero_construccion,
      lpc.numero_planta,
      loc.tipo,
      identificacion_plano,
      estado,
      superficie,
      tipo_superficie,
      lpc.largo_predominante,
      lpc.ancho_predominante,
      lpc.diametro,
      lpc.altura_maxima,
      lpc.altura_minima,
      loc.name AS nombre_local
    FROM locales_por_construccion lpc
    JOIN opciones_locales loc ON lpc.local_id = loc.id
    WHERE lpc.relevamiento_id = ?
    ORDER BY 
      lpc.numero_construccion ASC,
      lpc.identificacion_plano ASC
  `,
      [idNumber]
    );

    return NextResponse.json({ locales: localesPorRelevamiento });
  } catch (err: any) {
    // Usamos el operador de encadenamiento opcional (?) para evitar un error de TS
    console.error(`Error al obtener locales para ID ${relevamientoId}:`, err);
    // Si el error es un timeout de conexión, se capturará aquí (y será rápido si connectTimeout está bajo)
    return NextResponse.json(
      { message: "Error interno al consultar locales", error: err.message },
      { status: 500 }
    );
  }
}
