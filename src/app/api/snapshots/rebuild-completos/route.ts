// src/app/api/snapshots/rebuild-completos/route.ts
import { pool } from "@/app/lib/db";
import { recomputeEstadoConstruccion } from "@/app/lib/recompute-estado";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface RowConstruccionRel extends RowDataPacket {
  relevamiento_id: number;
  construccion_id: number;
}

export async function POST(req: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[] & RowConstruccionRel[]>(
      `
      SELECT c.id AS construccion_id,
             c.relevamiento_id AS relevamiento_id
      FROM construcciones c
      INNER JOIN relevamientos r ON r.id = c.relevamiento_id
      WHERE r.estado = 'completo'
    `
    );

    let ok = 0;
    const errores: any[] = [];

    for (const row of rows) {
      try {
        await recomputeEstadoConstruccion(
          row.relevamiento_id,
          row.construccion_id
        );
        ok++;
      } catch (e: any) {
        errores.push({
          relevamiento_id: row.relevamiento_id,
          construccion_id: row.construccion_id,
          error: e?.message,
        });
      }
    }

    return NextResponse.json(
      {
        ok: true,
        total: rows.length,
        procesados_ok: ok,
        errores,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/snapshots/rebuild-completos:", error);
    return NextResponse.json(
      { ok: false, error: error?.message },
      { status: 500 }
    );
  }
}
