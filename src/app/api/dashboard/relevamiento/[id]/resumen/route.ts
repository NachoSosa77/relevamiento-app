/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type NivelKpi = {
  nivel: string;
  edificios: number;
  aulas: number;
  m2: number;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = Number(decoded.id);

    // Guard: ADMIN
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

    const { id } = await params;
    const relevamientoId = Number(id);
    if (!relevamientoId || Number.isNaN(relevamientoId)) {
      return NextResponse.json(
        { message: "relevamientoId inválido" },
        { status: 400 }
      );
    }

    // -----------------------------
    // 1) Edificios por nivel
    // -----------------------------
    const sqlEdificios = `
      SELECT
        COALESCE(inst.modalidad_nivel, 'SIN NIVEL') AS nivel,
        COUNT(DISTINCT c.id) AS edificios
      FROM relevamientos r
      JOIN (
        SELECT
          i.cui,
          SUBSTRING_INDEX(GROUP_CONCAT(i.provincia ORDER BY i.id), ',', 1)       AS provincia,
          SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1)       AS localidad,
          SUBSTRING_INDEX(GROUP_CONCAT(i.modalidad_nivel ORDER BY i.id), ',', 1) AS modalidad_nivel
        FROM instituciones i
        WHERE i.provincia = 'La Pampa'
        GROUP BY i.cui
      ) inst                         ON inst.cui = r.cui_id
      JOIN construcciones c          ON c.relevamiento_id = r.id
      WHERE r.estado = 'completo'
        AND r.id = ?
      GROUP BY COALESCE(inst.modalidad_nivel, 'SIN NIVEL')
      ORDER BY nivel
    `;
    const [edificiosRows]: any[] = await pool.query(sqlEdificios, [
      relevamientoId,
    ]);

    // -----------------------------
    // 2) Aulas por nivel
    // -----------------------------
    const sqlAulas = `
  SELECT
    COALESCE(inst.modalidad_nivel, 'SIN NIVEL') AS nivel,
    COUNT(DISTINCT lpc.id) AS aulas
  FROM relevamientos r
  JOIN (
    SELECT
      i.cui,
      SUBSTRING_INDEX(GROUP_CONCAT(i.provincia ORDER BY i.id), ',', 1)       AS provincia,
      SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1)       AS localidad,
      SUBSTRING_INDEX(GROUP_CONCAT(i.modalidad_nivel ORDER BY i.id), ',', 1) AS modalidad_nivel
    FROM instituciones i
    WHERE i.provincia = 'La Pampa'
    GROUP BY i.cui
  ) inst                           ON inst.cui = r.cui_id
  JOIN construcciones c            ON c.relevamiento_id = r.id
  JOIN locales_por_construccion lpc ON lpc.construccion_id = c.id
  JOIN opciones_locales ol         ON ol.id = lpc.local_id
  WHERE r.estado = 'completo'
    AND r.id = ?
    AND ol.name IN (
      'Aula común',
      'Sala de nivel inicial',
      'Aula especial'
    )
  GROUP BY COALESCE(inst.modalidad_nivel, 'SIN NIVEL')
  ORDER BY nivel;
`;

    const [aulasRows]: any[] = await pool.query(sqlAulas, [relevamientoId]);

    // -----------------------------
    // 3) Metros2 por nivel
    // -----------------------------
    const sqlM2 = `
      SELECT
        COALESCE(inst.modalidad_nivel, 'SIN NIVEL') AS nivel,
        ROUND(SUM(
          COALESCE(
            c.superficie_total,
            COALESCE(c.superficie_cubierta, 0) + COALESCE(c.superficie_semicubierta, 0),
            0
          )
        ), 2) AS m2
      FROM relevamientos r
      JOIN (
        SELECT
          i.cui,
          SUBSTRING_INDEX(GROUP_CONCAT(i.provincia ORDER BY i.id), ',', 1)       AS provincia,
          SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1)       AS localidad,
          SUBSTRING_INDEX(GROUP_CONCAT(i.modalidad_nivel ORDER BY i.id), ',', 1) AS modalidad_nivel
        FROM instituciones i
        WHERE i.provincia = 'La Pampa'
        GROUP BY i.cui
      ) inst                         ON inst.cui = r.cui_id
      JOIN construcciones c          ON c.relevamiento_id = r.id
      WHERE r.estado = 'completo'
        AND r.id = ?
      GROUP BY COALESCE(inst.modalidad_nivel, 'SIN NIVEL')
      ORDER BY nivel
    `;
    const [m2Rows]: any[] = await pool.query(sqlM2, [relevamientoId]);

    // -----------------------------
    // 4) Construcciones por conservación (Bueno/Regular/Malo)
    // -----------------------------
    const sqlConsConstrucciones = `
      SELECT s.clasificacion, COUNT(*) AS construcciones
      FROM estado_construccion_snapshot s
      JOIN relevamientos r ON r.id = s.relevamiento_id
      WHERE s.relevamiento_id = ?
        AND r.estado = 'completo'
      GROUP BY s.clasificacion
      ORDER BY FIELD(s.clasificacion,'Bueno','Regular','Malo');
    `;
    const [consConstruccionesRows]: any[] = await pool.query(
      sqlConsConstrucciones,
      [relevamientoId]
    );

    const totalConstrucciones = (consConstruccionesRows || []).reduce(
      (acc: number, r: any) => acc + Number(r.construcciones || 0),
      0
    );

    // -----------------------------
    // 5) Edificios por nivel y conservación
    // -----------------------------
    const sqlEdifNivelCons = `
      SELECT
        COALESCE(inst.modalidad_nivel, 'SIN NIVEL') AS nivel,
        s.clasificacion AS conservacion,
        COUNT(s.construccion_id) AS construcciones
      FROM relevamientos r
      JOIN (
        SELECT
          i.cui,
          SUBSTRING_INDEX(GROUP_CONCAT(i.localidad ORDER BY i.id), ',', 1) AS localidad,
          SUBSTRING_INDEX(GROUP_CONCAT(i.modalidad_nivel ORDER BY i.id), ',', 1) AS modalidad_nivel
        FROM instituciones i
        WHERE i.provincia = 'La Pampa'
        GROUP BY i.cui
      ) inst ON inst.cui = r.cui_id
      JOIN estado_construccion_snapshot s ON s.relevamiento_id = r.id
      WHERE r.estado = 'completo'
        AND r.id = ?
      GROUP BY
        nivel,
        conservacion
      ORDER BY
        nivel,
        FIELD(conservacion, 'Bueno', 'Regular', 'Malo');
    `;
    const [edifNivelConsRows]: any[] = await pool.query(sqlEdifNivelCons, [
      relevamientoId,
    ]);

    const totalEdifNivelCons = (edifNivelConsRows || []).reduce(
      (acc: number, r: any) => acc + Number(r.construcciones || 0),
      0
    );

    // -----------------------------
    // 6) Merge por nivel (como mergedByNivel del dashboard)
    // -----------------------------
    const mapNivel = new Map<string, NivelKpi>();

    const upsert = (
      arr: any[],
      key: "edificios" | "aulas" | "m2",
      sourceKey: string
    ) => {
      (arr || []).forEach((i: any) => {
        const nivel = i.nivel ?? "SIN NIVEL";
        const prev =
          mapNivel.get(nivel) ||
          ({ nivel, edificios: 0, aulas: 0, m2: 0 } as NivelKpi);
        (prev as any)[key] = Number(i[sourceKey] || 0);
        mapNivel.set(nivel, prev);
      });
    };

    upsert(edificiosRows, "edificios", "edificios");
    upsert(aulasRows, "aulas", "aulas");
    upsert(m2Rows, "m2", "m2");

    const byNivel = Array.from(mapNivel.values()).sort((a, b) =>
      a.nivel.localeCompare(b.nivel)
    );

    const kpis = byNivel.reduce(
      (acc, x) => ({
        edificios: acc.edificios + (x.edificios || 0),
        aulas: acc.aulas + (x.aulas || 0),
        m2: acc.m2 + (x.m2 || 0),
      }),
      { edificios: 0, aulas: 0, m2: 0 }
    );

    return NextResponse.json(
      {
        relevamientoId,
        kpis, // { edificios, aulas, m2 }
        byNivel, // [{ nivel, edificios, aulas, m2 }, ...]
        construccionesPorConservacion: {
          items: consConstruccionesRows,
          total: totalConstrucciones,
        },
        edificiosPorNivelYConservacion: {
          items: edifNivelConsRows,
          total: totalEdifNivelCons,
        },
        // por si querés también las filas “crudas” originales:
        raw: {
          edificios: edificiosRows,
          aulas: aulasRows,
          m2: m2Rows,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(
      "GET /api/dashboard/relevamiento/[id]/resumen:",
      err?.message
    );
    return NextResponse.json(
      { message: "Error interno", error: err?.message },
      { status: 500 }
    );
  }
}
