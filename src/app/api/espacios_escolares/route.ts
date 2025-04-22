/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const connection = await getConnection();
  const body = await req.json();

  const {
    relevamiento_id,
    cui,
    cantidadConstrucciones,
    superficieTotalPredio,
    plano,
    observaciones,
    areasExteriores,
    // localesPorConstruccion,
    // instituciones,
  } = body;

  try {
    // 1. Crear el espacio escolar
    const [espacioEscolarResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO espacios_escolares (
        cantidad_construcciones, 
        superficie_total_predio, 
        plano, 
        observaciones, 
        cui, 
        relevamiento_id
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        cantidadConstrucciones,
        superficieTotalPredio,
        plano,
        observaciones,
        cui,
        relevamiento_id,
      ]
    );

    const espacio_escolar_id = espacioEscolarResult.insertId;

    // 2. Relacionar con las áreas exteriores
    if (Array.isArray(areasExteriores)) {
      for (const areaId of areasExteriores) {
        await connection.query(
          `INSERT INTO espacio_escolar_areas_exteriores (
            espacio_escolar_id, area_exterior_id
          ) VALUES (?, ?)`,
          [espacio_escolar_id, areaId]
        );
      }
    }

    connection.release();

    return NextResponse.json({
      message: "Espacio escolar y relaciones establecidas correctamente",
    });
  } catch (error: any) {
    console.error("Error al crear el espacio escolar:", error);
    connection.release();
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 }
    );
  }
}
