// src/app/lib/estado-construccion.ts
type Row = {
  relevamiento_id: number;
  construccion_id: number;
  tipo: string | null; // "estructura_resistente" | "techo" | "paredes_cerramientos" | "pisos"
  sub_tipo: string | null; // "estructura" | "cubierta" | "materiales" | "terminaciones"
  estado: string; // "Bueno" | "Regular" | "Malo"
};

const ESTADO_TO_POINTS: Record<string, number> = {
  BUENO: 100,
  REGULAR: 60,
  MALO: 20,
};

type Key =
  | "estructura"
  | "techo_estructura"
  | "techo_cubierta"
  | "paredes_materiales"
  | "paredes_terminaciones"
  | "pisos";

const PESOS_BASE: Record<Key, number> = {
  estructura: 0.35,
  techo_estructura: 0.15,
  techo_cubierta: 0.15,
  paredes_materiales: 0.12,
  paredes_terminaciones: 0.08,
  pisos: 0.15,
};

function toKey(row: Row): Key | null {
  const tipo = (row.tipo || "").toLowerCase();
  const sub = (row.sub_tipo || "").toLowerCase();
  if (tipo === "estructura_resistente") return "estructura";
  if (tipo === "techo") {
    if (sub === "estructura") return "techo_estructura";
    if (sub === "cubierta") return "techo_cubierta";
  }
  if (tipo === "paredes_cerramientos") {
    if (sub === "materiales") return "paredes_materiales";
    if (sub === "terminaciones") return "paredes_terminaciones";
  }
  if (tipo === "pisos") return "pisos";
  return null;
}

function points(estado: string) {
  return ESTADO_TO_POINTS[(estado || "").toUpperCase()] ?? 60;
}

function normalizeWeights(present: Key[]) {
  const sum = present.reduce((a, k) => a + PESOS_BASE[k], 0) || 1;
  const out: Record<Key, number> = { ...PESOS_BASE };
  (Object.keys(PESOS_BASE) as Key[]).forEach((k) => {
    out[k] = present.includes(k) ? PESOS_BASE[k] / sum : 0;
  });
  return out;
}

function clasif(score: number): "Bueno" | "Regular" | "Malo" {
  if (score >= 80) return "Bueno";
  if (score >= 50) return "Regular";
  return "Malo";
}

export function computeConstructionScore(rows: Row[]) {
  // Tomamos el mejor estado si hubiera múltiples filas del mismo subcomponente
  const best = new Map<Key, number>();
  for (const r of rows) {
    const k = toKey(r);
    if (!k) continue;
    const p = points(r.estado);
    const prev = best.get(k);
    if (prev == null || p > prev) best.set(k, p);
  }

  const present = Array.from(best.keys());
  if (!present.length)
    return { score: 0, clasificacion: "Malo" as const, detalle: [] as any[] };

  const weights = normalizeWeights(present);
  let score = 0;
  const detalle: {
    key: Key;
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
  return { score: finalScore, clasificacion: clasif(finalScore), detalle };
}
