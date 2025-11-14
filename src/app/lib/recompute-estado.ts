// src/app/lib/recompute-estado.ts
import { getConnection } from "@/app/lib/db";
import { computeConstructionScore } from "./estado-construccion";

function normalizeEstado(v: any): "Bueno" | "Regular" | "Malo" | null {
  if (!v) return null;
  const s = String(v).trim().toLowerCase();
  if (s === "bueno") return "Bueno";
  if (s === "regular") return "Regular";
  if (s === "malo") return "Malo";
  return null; // desconocido => mejor no contaminar el cálculo
}

export async function recomputeEstadoConstruccion(
  relevamiento_id: number,
  construccion_id: number
) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.execute<any[]>(
      `SELECT relevamiento_id, construccion_id, tipo, sub_tipo, estado
         FROM estado_conservacion
        WHERE relevamiento_id = ? AND construccion_id = ?`,
      [relevamiento_id, construccion_id]
    );

    // Guard: si no hay fuente, no generar snapshot vacía
    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn(
        "[recomputeEstadoConstruccion] Sin filas en estado_conservacion para",
        { relevamiento_id, construccion_id }
      );
      // Podés elegir: lanzar error o devolver un resultado “pendiente”.
      // Yo devuelvo un error controlado:
      throw new Error(
        "No hay datos en estado_conservacion para calcular el snapshot."
      );
    }

    // Normalizar estados para el scorer
    const fuente = rows.map((r) => ({
      ...r,
      estado: normalizeEstado(r.estado),
    }));

    // Si todos quedaron null por estados inválidos, evitá snapshot
    const validos = fuente.filter((f) => f.estado !== null);
    if (validos.length === 0) {
      console.warn(
        "[recomputeEstadoConstruccion] Todos los estados inválidos/NULL",
        { relevamiento_id, construccion_id }
      );
      throw new Error(
        "Estados inválidos/NULL en estado_conservacion; no se puede calcular."
      );
    }

    const res = computeConstructionScore(validos as any[]);

    // Sanity-check de salida del scorer
    if (
      typeof res?.score !== "number" ||
      !["Bueno", "Regular", "Malo"].includes(String(res?.clasificacion))
    ) {
      console.error(
        "[recomputeEstadoConstruccion] Scorer devolvió inválido:",
        res
      );
      throw new Error("Scoring inválido.");
    }

    const detalle = JSON.stringify(res.detalle ?? []);

    await conn.execute(
      `INSERT INTO estado_construccion_snapshot
         (relevamiento_id, construccion_id, score, clasificacion, detalle_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         score = VALUES(score),
         clasificacion = VALUES(clasificacion),
         detalle_json = VALUES(detalle_json),
         updated_at = CURRENT_TIMESTAMP`,
      [relevamiento_id, construccion_id, res.score, res.clasificacion, detalle]
    );

    return res; // { score, clasificacion, detalle }
  } finally {
    conn.release();
  }
}
