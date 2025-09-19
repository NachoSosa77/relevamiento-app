import { getConnection } from "@/app/lib/db";
import { getAberturasByRelevamientoIdAndLocalId } from "@/app/lib/server/aberturaDb";
import { getAcondicionamientoTermicoByRelevamientoId } from "@/app/lib/server/acondicionamientoTermincoDb";
import { getEquipamientoCocinaOfficesByRelevamientoId } from "@/app/lib/server/equipamientoOfficeDb";
import { getEquipamientoSanitariosByRelevamientoId } from "@/app/lib/server/equipamientoSanitarioDb";
import { getIluminacionVentilacionByRelevamientoId } from "@/app/lib/server/iluminacionVentilacionDb";
import { getInstalacionesBasicasByRelevamientoId } from "@/app/lib/server/instalacionesBasicasDb";
import { getMaterialesPredominantesByRelevamientoId } from "@/app/lib/server/materialesPredominantesDb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const localId = Number(id);
    const url = new URL(req.url);
    const relevamientoIdStr = url.searchParams.get("relevamientoId");

    if (!relevamientoIdStr) {
      return NextResponse.json(
        { message: "Falta relevamientoId" },
        { status: 400 }
      );
    }

    const relevamientoId = Number(relevamientoIdStr);
    if (isNaN(localId) || isNaN(relevamientoId)) {
      return NextResponse.json(
        { message: "ID de local o relevamiento inválido" },
        { status: 400 }
      );
    }

    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        `SELECT l.*, o.name AS nombre_local
         FROM locales_por_construccion l
         LEFT JOIN opciones_locales o ON o.id = l.local_id
         WHERE l.id = ? AND l.relevamiento_id = ?`,
        [localId, relevamientoId]
      );

      const local = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

      if (!local) {
        return NextResponse.json(
          { message: "Local no encontrado" },
          { status: 404 }
        );
      }

      const [
        aberturas,
        acondicionamientoTermico,
        equipamientoCocina,
        equipamientoSanitario,
        iluminacionVentilacion,
        instalacionesBasicas,
        materialesPredominantes,
      ] = await Promise.all([
        getAberturasByRelevamientoIdAndLocalId(relevamientoId, localId, conn),
        getAcondicionamientoTermicoByRelevamientoId(
          relevamientoId,
          localId,
          conn
        ),
        getEquipamientoCocinaOfficesByRelevamientoId(
          relevamientoId,
          localId,
          conn
        ),
        getEquipamientoSanitariosByRelevamientoId(
          relevamientoId,
          localId,
          conn
        ),
        getIluminacionVentilacionByRelevamientoId(
          relevamientoId,
          localId,
          conn
        ),
        getInstalacionesBasicasByRelevamientoId(relevamientoId, localId, conn),
        getMaterialesPredominantesByRelevamientoId(
          relevamientoId,
          localId,
          conn
        ),
      ]);

      const responsePayload = {
        local: {
          ...local,
          aberturas,
          acondicionamientoTermico,
          equipamientoCocina,
          equipamientoSanitario,
          iluminacionVentilacion,
          instalacionesBasicas,
          materialesPredominantes,
        },
      };

      return NextResponse.json(responsePayload);
    } finally {
      conn.release();
    }
  } catch (error: unknown) {
    console.error("Error en GET local detalle:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Error interno", error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const localId = Number(id);

    if (isNaN(localId)) {
      return NextResponse.json(
        { message: "ID de local inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      construccion_id,
      identificacion_plano,
      numero_planta,
      local_sin_uso,
      superficie,
      cui_number,
      tipo,
      local_id: nuevoLocalId,
      largo_predominante,
      ancho_predominante,
      diametro,
      altura_maxima,
      altura_minima,
      destino_original,
      proteccion_contra_robo,
      observaciones,
      tipo_superficie,
      numero_construccion,
      estado,
    } = body;

    const conn = await getConnection();

    try {
      await conn.query(
        `UPDATE locales_por_construccion
         SET 
          construccion_id = ?,
          identificacion_plano = ?,
          numero_planta = ?,
          local_sin_uso = ?,
          superficie = ?,
          cui_number = ?,
          tipo = ?,
          local_id = ?,
          largo_predominante = ?,
          ancho_predominante = ?,
          diametro = ?,
          altura_maxima = ?,
          altura_minima = ?,
          destino_original = ?,
          proteccion_contra_robo = ?,
          observaciones = ?,
          tipo_superficie = ?,
          numero_construccion = ?,
          estado = ?
         WHERE id = ?`,
        [
          construccion_id,
          identificacion_plano,
          numero_planta,
          local_sin_uso,
          superficie,
          cui_number,
          tipo,
          nuevoLocalId,
          largo_predominante,
          ancho_predominante,
          diametro,
          altura_maxima,
          altura_minima,
          destino_original,
          proteccion_contra_robo,
          observaciones,
          tipo_superficie,
          numero_construccion,
          estado,
          localId,
        ]
      );

      return NextResponse.json({ message: "Local actualizado correctamente" });
    } finally {
      conn.release();
    }
  } catch (err: unknown) {
    console.error("Error al actualizar local:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { message: "Error al actualizar local", error: message },
      { status: 500 }
    );
  }
}
