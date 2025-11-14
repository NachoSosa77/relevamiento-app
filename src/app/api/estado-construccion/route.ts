import { getConnection } from "@/app/lib/db";
import { recomputeEstadoConstruccion } from "@/app/lib/recompute-estado";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/estado-construccion?relevamiento_id=...&construccion_id=...[&refresh=true]
 * - Lee snapshot (rápido).
 * - Si no existe o refresh=true -> recalcula on-the-fly y actualiza snapshot.
 */
export async function GET(req: NextRequest) {
  const relevamientoStr = req.nextUrl.searchParams.get("relevamiento_id");
  const construccionStr = req.nextUrl.searchParams.get("construccion_id");
  const refresh =
    (req.nextUrl.searchParams.get("refresh") || "").toLowerCase() === "true";

  const relevamiento_id = Number(relevamientoStr);
  const construccion_id = Number(construccionStr);

  if (
    !relevamientoStr ||
    !construccionStr ||
    Number.isNaN(relevamiento_id) ||
    Number.isNaN(construccion_id)
  ) {
    return NextResponse.json(
      {
        error:
          "Parámetros inválidos. Enviar relevamiento_id y construccion_id numéricos.",
      },
      { status: 400 }
    );
  }

  const conn = await getConnection();
  try {
    // Si no se pide refresh, intentamos snapshot
    if (!refresh) {
      const [rows] = await conn.execute<any[]>(
        `SELECT score, clasificacion, detalle_json, created_at, updated_at
           FROM estado_construccion_snapshot
          WHERE relevamiento_id = ? AND construccion_id = ?`,
        [relevamiento_id, construccion_id]
      );

      if (rows.length > 0) {
        // Normalizamos detalle_json a objeto si viene como string
        const row = rows[0];
        const detalle =
          typeof row.detalle_json === "string"
            ? JSON.parse(row.detalle_json)
            : row.detalle_json;
        return NextResponse.json(
          {
            score: Number(row.score),
            clasificacion: row.clasificacion,
            detalle_json: detalle,
            created_at: row.created_at,
            updated_at: row.updated_at,
            source: "snapshot",
          },
          { status: 200 }
        );
      }
    }

    // Si no hay snapshot o se pidió refresh -> recalcular y upsert
    const result = await recomputeEstadoConstruccion(
      relevamiento_id,
      construccion_id
    );

    return NextResponse.json(
      {
        score: result.score,
        clasificacion: result.clasificacion,
        detalle_json: result.detalle,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source: refresh ? "recompute(refresh)" : "recompute(fallback)",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/estado-construccion error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    conn.release();
  }
}
