/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data = await req.json();

    const {
      cui,
      cantidadConstrucciones,
      superficieTotalPredio,
      plano,
      observaciones,
      areasExteriores,
      locales,
      institucionesSeleccionadas,
    } = data;

    // Insertar en espacio_escolar
    const [espacioResult]: any = await connection.query(
      `INSERT INTO espacios_escolares (cui, cantidad_construcciones, superficie_total_predio, plano, observaciones)
       VALUES (?, ?, ?, ?, ?)`,
      [cui, cantidadConstrucciones, superficieTotalPredio, plano, observaciones]
    );

    const espacioEscolarId = espacioResult.insertId;

    // Insertar relaciones con áreas exteriores
    for (const area of areasExteriores) {
      await connection.query(
        `INSERT INTO areas_exteriores (identificacion_plano, tipo, superficie)
         VALUES (?, ?, ?)`,
        [area.identificacion_plano, area.tipo, area.superficie]
      );
      const [areaResult]: any = await connection.query(
        "SELECT LAST_INSERT_ID() as id"
      );
      await connection.query(
        `INSERT INTO espacio_escolar_areas_exteriores (espacio_escolar_id, area_exterior_id)
         VALUES (?, ?)`,
        [espacioEscolarId, areaResult[0].id]
      );
    }

    // Insertar relaciones con locales
    for (const local of locales) {
      await connection.query(
        `INSERT INTO locales_por_construccion (identificacion_plano, numero_planta, tipo, local_sin_uso, superficie)
         VALUES (?, ?, ?, ?, ?)`,
        [
          local.identificacion_plano,
          local.numero_planta,
          local.tipo,
          local.local_sin_uso,
          local.superficie,
        ]
      );
      const [localResult]: any = await connection.query(
        "SELECT LAST_INSERT_ID() as id"
      );
      await connection.query(
        `INSERT INTO espacio_escolar_locales (espacio_escolar_id, local_id)
         VALUES (?, ?)`,
        [espacioEscolarId, localResult[0].id]
      );
    }

    // Insertar relaciones con instituciones
    for (const institucion of institucionesSeleccionadas) {
      await connection.query(
        `INSERT INTO espacio_escolar_instituciones (espacio_escolar_id, institucion_id)
         VALUES (?, ?)`,
        [espacioEscolarId, institucion.id]
      );
    }

    connection.release();
    return NextResponse.json(
      { message: "Espacio escolar insertado correctamente" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error al insertar espacio escolar:", err);
    return NextResponse.json(
      { message: "Error al insertar espacio escolar", error: err.message },
      { status: 500 }
    );
  }
}
