// src/app/lib/estado-local.ts

type RowLocal = {
  relevamiento_id: number;
  local_id: number;
  item: string | null;
  material: string | null;
  estado: string | null;
};

const ESTADO_TO_POINTS: Record<string, number> = {
  BUENO: 100,
  REGULAR: 60,
  MALO: 20,
};

type KeyLocal =
  | "techo"
  | "paredes"
  | "piso"
  | "revoques"
  | "cielorraso"
  | "pintura";

const PESOS_BASE_LOCAL: Record<KeyLocal, number> = {
  techo: 0.25,
  paredes: 0.25,
  piso: 0.2,
  revoques: 0.15,
  cielorraso: 0.1,
  pintura: 0.05,
};

const CRITICAL_KEYS: KeyLocal[] = ["techo", "paredes", "piso", "revoques"];

function toKeyLocal(row: RowLocal): KeyLocal | null {
  const item = (row.item || "").toLowerCase().trim();

  if (item.startsWith("techo")) return "techo";
  if (item.startsWith("paredes")) return "paredes";
  if (item.startsWith("piso")) return "piso";
  if (item.startsWith("revoques")) return "revoques";
  if (item.startsWith("cielorraso")) return "cielorraso";
  if (item.startsWith("pintura")) return "pintura";

  return null;
}

function pointsLocal(estado: string | null | undefined) {
  return ESTADO_TO_POINTS[(estado || "").toUpperCase()] ?? 60;
}

function normalizeWeightsLocal(present: KeyLocal[]) {
  const sum = present.reduce((a, k) => a + PESOS_BASE_LOCAL[k], 0) || 1;
  const out: Record<KeyLocal, number> = { ...PESOS_BASE_LOCAL };
  (Object.keys(PESOS_BASE_LOCAL) as KeyLocal[]).forEach((k) => {
    out[k] = present.includes(k) ? PESOS_BASE_LOCAL[k] / sum : 0;
  });
  return out;
}

function clasifLocal(score: number): "Bueno" | "Regular" | "Malo" {
  if (score >= 80) return "Bueno";
  if (score >= 50) return "Regular";
  return "Malo";
}

export function computeLocalScore(rows: RowLocal[]) {
  if (!rows || rows.length === 0) {
    return {
      score: 0,
      clasificacionScore: "Malo" as const,
      clasificacion: "Malo" as const,
      detalle: [] as any[],
      tieneCriticoMalo: false,
      criticosMalo: [] as KeyLocal[],
    };
  }

  const best = new Map<KeyLocal, number>();
  const worstEstadoPorKey = new Map<KeyLocal, string>();

  for (const r of rows) {
    const k = toKeyLocal(r);
    if (!k) continue;

    const pts = pointsLocal(r.estado);
    const prev = best.get(k);
    if (prev == null || pts > prev) best.set(k, pts);

    const estadoUpper = (r.estado || "").toUpperCase();
    const prevWorst = worstEstadoPorKey.get(k);
    if (!prevWorst) {
      worstEstadoPorKey.set(k, estadoUpper);
    } else {
      // guardamos el PEOR (Malo > Regular > Bueno)
      const rank = { BUENO: 1, REGULAR: 2, MALO: 3 } as const;
      if (
        rank[estadoUpper as keyof typeof rank] >
        rank[prevWorst as keyof typeof rank]
      ) {
        worstEstadoPorKey.set(k, estadoUpper);
      }
    }
  }

  const present = Array.from(best.keys());
  if (!present.length) {
    return {
      score: 0,
      clasificacionScore: "Malo" as const,
      clasificacion: "Malo" as const,
      detalle: [] as any[],
      tieneCriticoMalo: false,
      criticosMalo: [] as KeyLocal[],
    };
  }

  const criticosMalo = CRITICAL_KEYS.filter(
    (k) => worstEstadoPorKey.get(k) === "MALO"
  );
  const tieneCriticoMalo = criticosMalo.length > 0;

  const weights = normalizeWeightsLocal(present);
  let score = 0;
  const detalle: {
    key: KeyLocal;
    points: number;
    weight: number;
    partial: number;
  }[] = [];

  for (const k of present) {
    const pts = best.get(k)!;
    const w = weights[k];
    const partial = pts * w;
    detalle.push({ key: k, points: pts, weight: w, partial });
    score += partial;
  }

  const finalScore = Math.round(score * 10) / 10;
  const clasificacionScore = clasifLocal(finalScore);

  // 🔧 Regla dura actual (igual a la que ya tenés)
  let clasificacion = clasificacionScore;
  if (tieneCriticoMalo) {
    clasificacion = "Malo";
  }

  return {
    score: finalScore,
    clasificacionScore, // solo por score
    clasificacion, // con ajuste por críticos
    detalle,
    tieneCriticoMalo,
    criticosMalo,
  };
}
