// app/api/dashboard/relevamiento/[id]/detalle/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { computeLocalScore } from "@/app/lib/estado-local";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Auth + ADMIN, igual que otros endpoints de dashboard
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = Number(decoded.id);

    const [adminRows]: any[] = await pool.query(
      `
      SELECT 1
      FROM user_role ur
      JOIN role r ON r.id = ur.role_id AND r.is_active = 1
      WHERE ur.user_id = ? AND r.name = 'ADMIN'
      LIMIT 1
      `,
      [userId]
    );

    if (!Array.isArray(adminRows) || adminRows.length === 0) {
      return NextResponse.json({ message: "Sin permiso" }, { status: 403 });
    }

    // ✅ params como Promise (Sync Dynamic APIs)
    const { id } = await params;
    const relevamientoId = Number(id);

    if (!relevamientoId || Number.isNaN(relevamientoId)) {
      return NextResponse.json(
        { message: "relevamientoId inválido" },
        { status: 400 }
      );
    }

    // 1) Info básica: a partir del relevamiento (traemos CUI + instituciones)
    const [infoRows]: any[] = await pool.query(
      `
      SELECT
        r.id AS relevamiento_id,
        r.cui_id AS cui,
        inst.localidad,
        inst.modalidad_nivel,
        inst.inst_ids,
        inst.inst_nombres
      FROM relevamientos r
      JOIN (
        SELECT
          i.cui,
          SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1) AS localidad,
          SUBSTRING_INDEX(GROUP_CONCAT(i.modalidad_nivel ORDER BY i.id), ',', 1) AS modalidad_nivel,
          GROUP_CONCAT(i.id ORDER BY i.id) AS inst_ids,
          GROUP_CONCAT(COALESCE(i.institucion, CONCAT('Inst ', i.id)) ORDER BY i.id) AS inst_nombres
        FROM instituciones i
        WHERE UPPER(i.provincia) = 'LA PAMPA'
        GROUP BY i.cui
      ) inst ON inst.cui = r.cui_id
      WHERE r.id = ?
  AND r.estado = 'completo'
LIMIT 1
      `,
      [relevamientoId]
    );

    if (!Array.isArray(infoRows) || infoRows.length === 0) {
      return NextResponse.json(
        { message: "No se encontró el relevamiento" },
        { status: 404 }
      );
    }

    const infoRow = infoRows[0];

    const info = {
      cui: Number(infoRow.cui),
      localidad: infoRow.localidad,
      modalidad_nivel: infoRow.modalidad_nivel,
      relevamiento_id: Number(infoRow.relevamiento_id),
      instituciones: String(infoRow.inst_ids)
        .split(",")
        .map((idStr: string, idx: number) => ({
          id: Number(idStr),
          nombre:
            String(infoRow.inst_nombres).split(",")[idx] ?? `Inst ${idStr}`,
        })),
    };

    // 2) Bloque 2 — Preguntas 3–6 (conservación + servicios) SOLO para ese relevamiento
    const [b2Rows]: any[] = await pool.query(
      `
  SELECT
    t.relevamiento_id,
    t.construccion_id,
    c.numero_construccion,         -- 👈 NUEVO
    t.tipo,
    t.sub_tipo,
    t.categoria,
    t.estado
  FROM (
    -- a) Estado de conservación de la construcción
    SELECT
      ecs.relevamiento_id,
      ecs.construccion_id,
      ecs.tipo,
      ecs.sub_tipo,
      ecs.estructura AS categoria,
      ecs.estado
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

    -- e) Servicio de electricidad (ahora usamos disponibilidad, estado NULL)
    SELECT
      se.relevamiento_id,
      se.construccion_id,
      'servicio_electricidad' AS tipo,
      'electricidad'          AS sub_tipo,
      se.disponibilidad       AS categoria,
      NULL                    AS estado
    FROM servicio_electricidad se
  ) AS t
  JOIN relevamientos r ON r.id = t.relevamiento_id
  JOIN construcciones c ON c.id = t.construccion_id   -- 👈 JOIN a construcciones
  WHERE r.estado = 'completo'
    AND r.id = ?
  ORDER BY t.relevamiento_id, t.construccion_id, t.tipo, t.sub_tipo
  `,
      [relevamientoId]
    );

    const bloque2 = (b2Rows || []).map((r: any) => ({
      construccion_id: Number(r.construccion_id),
      numero_construccion:
        r.numero_construccion != null ? Number(r.numero_construccion) : null, // 👈 mejor así
      tipo: r.tipo,
      sub_tipo: r.sub_tipo,
      categoria: r.categoria,
      estado: (r.estado ?? null) as "Bueno" | "Regular" | "Malo" | null,
    }));

    // 3) Bloque 3 — locales + estado por materiales_predominantes (solo ese relevamiento)
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
        AND r.id = ?
      ORDER BY c.id, lpc.id
      `,
      [relevamientoId]
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
    console.error(
      "GET /api/dashboard/relevamiento/[id]/detalle:",
      err?.message
    );
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
