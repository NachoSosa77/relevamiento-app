/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { computeLocalScore } from "@/app/lib/estado-local";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/resumen-establecimiento?cui=4200061
 *
 * Devuelve:
 * {
 *   info: {
 *     cui,
 *     localidad,
 *     modalidad_nivel,
 *     relevamiento_id: number | null,
 *     instituciones: [{id, nombre}]
 *   },
 *   bloque2: [
 *     { construccion_id, tipo, sub_tipo, categoria, estado }, ...
 *   ],
 *   bloque3: [
 *     { tipo_local, identificacion, estado_local, observaciones, score_local?, tieneCriticoMalo? }, ...
 *   ]
 * }
 */
export async function GET(req: NextRequest) {
  try {
    const cuiStr = req.nextUrl.searchParams.get("cui");
    if (!cuiStr) {
      return NextResponse.json(
        { message: "Falta parámetro 'cui'" },
        { status: 400 }
      );
    }
    const cui = Number(cuiStr);
    if (Number.isNaN(cui)) {
      return NextResponse.json(
        { message: "Parámetro 'cui' inválido" },
        { status: 400 }
      );
    }

    // 1) Info básica del establecimiento (por CUI, provincia LA PAMPA)
    const [instRows]: any[] = await pool.query(
      `
      SELECT
        i.cui,
        SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1) AS localidad,
        SUBSTRING_INDEX(GROUP_CONCAT(i.modalidad_nivel ORDER BY i.id), ',', 1) AS modalidad_nivel,
        GROUP_CONCAT(i.id ORDER BY i.id) AS inst_ids,
        GROUP_CONCAT(COALESCE(i.institucion, CONCAT('Inst ', i.id)) ORDER BY i.id) AS inst_nombres
      FROM instituciones i
      WHERE UPPER(i.provincia) = 'LA PAMPA' AND i.cui = ?
      GROUP BY i.cui
      `,
      [cui]
    );

    if (!Array.isArray(instRows) || instRows.length === 0) {
      return NextResponse.json(
        { message: "No se encontraron instituciones para ese CUI" },
        { status: 404 }
      );
    }

    // 2) Buscar el ÚLTIMO relevamiento COMPLETO para ese CUI
    let relevamientoId: number | null = null;

    const [revRows]: any[] = await pool.query(
      `
      SELECT r.id
      FROM relevamientos r
      WHERE r.cui_id = ?
        AND r.estado = 'completo'
      ORDER BY r.id DESC
      LIMIT 1
      `,
      [cui]
    );

    if (Array.isArray(revRows) && revRows.length > 0) {
      relevamientoId = Number(revRows[0].id);
    }

    const info = {
      cui,
      localidad: instRows[0].localidad,
      modalidad_nivel: instRows[0].modalidad_nivel,
      relevamiento_id: relevamientoId,
      instituciones: String(instRows[0].inst_ids)
        .split(",")
        .map((id: string, idx: number) => ({
          id: Number(id),
          nombre:
            String(instRows[0].inst_nombres).split(",")[idx] ?? `Inst ${id}`,
        })),
    };

    // Si no hay relevamiento completo, devolvemos info + bloques vacíos
    if (!relevamientoId) {
      return NextResponse.json(
        {
          info,
          bloque2: [],
          bloque3: [],
        },
        { status: 200 }
      );
    }

    // 3) Bloque 2 — Preguntas 3–6: estado de construcción + servicios, SOLO para ese relevamiento
    const [b2Rows]: any[] = await pool.query(
      `
      SELECT
        t.relevamiento_id,
        t.construccion_id,
        t.tipo,
        t.sub_tipo,
        t.categoria,
        t.estado
      FROM (
        -- a) Estado de conservación de la construcción (estructura, techo, paredes)
        SELECT
          ecs.relevamiento_id,
          ecs.construccion_id,
          ecs.tipo,                        -- 'estructura_resistente' | 'techo' | 'paredes_cerramientos'
          ecs.sub_tipo,                    -- 'estructura' | 'cubierta' | 'materiales' | 'terminaciones'
          ecs.estructura AS categoria,     -- p.ej. 'Losa', 'Membrana', 'Mampostería...'
          ecs.estado                       -- 'Bueno' | 'Regular' | 'Malo'
        FROM estado_conservacion ecs

        UNION ALL

        -- b1) Servicio de agua · Provisión
        SELECT
          sa.relevamiento_id,
          sa.construccion_id,
          'servicio_agua'     AS tipo,
          'provisión de agua' AS sub_tipo,
          JSON_UNQUOTE(JSON_EXTRACT(sa.tipo_provision, '$[0]')) AS categoria,
          NULLIF(JSON_UNQUOTE(JSON_EXTRACT(sa.tipo_provision_estado, '$[0]')), '') AS estado
        FROM servicio_agua sa

        UNION ALL

        -- b2) Servicio de agua · Almacenamiento
        SELECT
          sa.relevamiento_id,
          sa.construccion_id,
          'servicio_agua'       AS tipo,
          'almacenamiento agua' AS sub_tipo,
          JSON_UNQUOTE(JSON_EXTRACT(sa.tipo_almacenamiento, '$[0]')) AS categoria,
          NULLIF(JSON_UNQUOTE(JSON_EXTRACT(sa.tipo_almacenamiento_estado, '$[0]')), '') AS estado
        FROM servicio_agua sa

        UNION ALL

        -- c) Servicio de desagüe
        SELECT
          sd.relevamiento_id,
          sd.construccion_id,
          'servicio_desague' AS tipo,
          'desagüe'          AS sub_tipo,
          sd.servicio        AS categoria,
          sd.estado          AS estado
        FROM servicio_desague sd

        UNION ALL

        -- d) Servicio de gas
        SELECT
          sg.relevamiento_id,
          sg.construccion_id,
          'servicio_gas' AS tipo,
          'gas'          AS sub_tipo,
          sg.servicio    AS categoria,
          sg.estado      AS estado
        FROM servicio_gas sg

        UNION ALL

        -- e) Servicio de electricidad
        SELECT
          se.relevamiento_id,
          se.construccion_id,
          'servicio_electricidad' AS tipo,
          'electricidad'          AS sub_tipo,
          se.servicio             AS categoria,
          se.estado               AS estado
        FROM servicio_electricidad se
      ) AS t
      JOIN relevamientos r ON r.id = t.relevamiento_id
      WHERE r.estado = 'completo'
        AND r.cui_id = ?
        AND r.id = ?   -- 👈 solo el último relevamiento completo
      ORDER BY t.relevamiento_id, t.construccion_id, t.tipo, t.sub_tipo
      `,
      [cui, relevamientoId]
    );

    const bloque2 = (b2Rows || []).map((r: any) => ({
      construccion_id: Number(r.construccion_id),
      tipo: r.tipo,
      sub_tipo: r.sub_tipo,
      categoria: r.categoria,
      estado: (r.estado ?? null) as "Bueno" | "Regular" | "Malo" | null,
    }));

    // 4) Bloque 3 — locales + estado por materiales_predominantes, SOLO ese relevamiento
    const [b3Rows]: any[] = await pool.query(
      `
      SELECT
        COALESCE(ol.name, lpc.tipo) AS tipo_local,
        COALESCE(NULLIF(lpc.identificacion_plano,''), CONCAT('Local #', lpc.id)) AS identificacion,
        lpc.observaciones AS observaciones,
        lpc.id AS local_id,
        r.id  AS relevamiento_id
      FROM relevamientos r
      JOIN construcciones c              ON c.relevamiento_id = r.id
      JOIN locales_por_construccion lpc  ON lpc.construccion_id = c.id
      LEFT JOIN opciones_locales ol      ON ol.id = lpc.local_id
      WHERE r.estado = 'completo'
        AND r.cui_id = ?
        AND r.id = ?   -- 👈 mismo relevamiento
      ORDER BY c.id, lpc.id
      `,
      [cui, relevamientoId]
    );

    const bloque3 = await Promise.all(
      (b3Rows || []).map(async (r: any) => {
        const localId = Number(r.local_id);
        const revId = Number(r.relevamiento_id);

        const [matRows]: any[] = await pool.query(
          `
          SELECT 
            item, 
            material, 
            estado, 
            relevamiento_id, 
            local_id
          FROM materiales_predominantes
          WHERE local_id = ? AND relevamiento_id = ?
          `,
          [localId, revId]
        );

        const materiales = (matRows || []).map((m: any) => ({
          item: m.item as string | null,
          material: m.material as string | null,
          estado: m.estado as string | null,
          relevamiento_id: Number(m.relevamiento_id),
          local_id: Number(m.local_id),
        }));

        const estadoLocal = computeLocalScore(materiales);

        return {
          tipo_local: r.tipo_local,
          identificacion: r.identificacion,
          estado_local: estadoLocal.clasificacion, // "Bueno" | "Regular" | "Malo" | "Sin datos"
          observaciones: r.observaciones ?? null,
          score_local: estadoLocal.score,
          tieneCriticoMalo: estadoLocal.tieneCriticoMalo,
        };
      })
    );

    return NextResponse.json({ info, bloque2, bloque3 }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/dashboard/resumen-establecimiento:", err?.message);
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
