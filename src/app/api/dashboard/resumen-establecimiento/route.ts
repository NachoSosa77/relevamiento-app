/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/resumen-establecimiento?cui=4200061
 *
 * Devuelve:
 * {
 *   info: { cui, localidad, modalidad_nivel, instituciones: [{id, nombre}] },
 *   bloque2: [
 *     { tipo, sub_tipo, categoria, estado }, ...
 *   ],
 *   bloque3: [
 *     { tipo_local, identificacion, estado_local, observaciones }, ...
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

    // 1) Info del establecimiento (dedup por CUI) — provincia fija LA PAMPA
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

    const info = {
      cui,
      localidad: instRows[0].localidad,
      modalidad_nivel: instRows[0].modalidad_nivel,
      instituciones: String(instRows[0].inst_ids)
        .split(",")
        .map((id: string, idx: number) => ({
          id: Number(id),
          nombre:
            String(instRows[0].inst_nombres).split(",")[idx] ?? `Inst ${id}`,
        })),
    };

    // 2) Bloque 2 — desde estado_conservacion, solo relevamientos completos
    const [b2Rows]: any[] = await pool.query(
      `
      SELECT
        ecs.relevamiento_id,
        ecs.construccion_id,
        ecs.tipo,
        ecs.sub_tipo,
        ecs.estado,
        ecs.estructura AS categoria
      FROM estado_conservacion ecs
      JOIN relevamientos r ON r.id = ecs.relevamiento_id
      WHERE r.estado = 'completo'
        AND r.cui_id = ?
        AND ecs.tipo IN ('estructura_resistente','techo','paredes_cerramientos')
      ORDER BY ecs.relevamiento_id, ecs.construccion_id, ecs.tipo, ecs.sub_tipo
      `,
      [cui]
    );

    const bloque2 = (b2Rows || []).map((r: any) => ({
      tipo: r.tipo, // 'estructura_resistente' | 'techo' | 'paredes_cerramientos'
      sub_tipo: r.sub_tipo, // 'estructura' | 'cubierta' | 'materiales' | 'terminaciones'
      categoria: r.categoria, // p.ej. 'Losa', 'Membrana', 'Mampostería de ladrillo...'
      estado: r.estado, // 'Bueno' | 'Regular' | 'Malo'
    }));

    // 3) Bloque 3 — locales_por_construccion + opciones_locales (no hay estado por local en tu DDL)
    const [b3Rows]: any[] = await pool.query(
      `
      SELECT
        COALESCE(ol.name, lpc.tipo) AS tipo_local,
        COALESCE(NULLIF(lpc.identificacion_plano,''), CONCAT('Local #', lpc.id)) AS identificacion,
        NULL AS estado_local,             -- no existe columna de estado por local
        lpc.observaciones AS observaciones
      FROM relevamientos r
      JOIN construcciones c       ON c.relevamiento_id = r.id
      JOIN locales_por_construccion lpc ON lpc.construccion_id = c.id
      LEFT JOIN opciones_locales ol     ON ol.id = lpc.local_id
      WHERE r.estado = 'completo'
        AND r.cui_id = ?
      ORDER BY c.id, lpc.id
      `,
      [cui]
    );

    const bloque3 = (b3Rows || []).map((r: any) => ({
      tipo_local: r.tipo_local,
      identificacion: r.identificacion,
      estado_local: r.estado_local, // siempre null (no hay columna)
      observaciones: r.observaciones ?? null,
    }));

    return NextResponse.json({ info, bloque2, bloque3 }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/dashboard/resumen-establecimiento:", err?.message);
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
