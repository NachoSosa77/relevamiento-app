// src/app/panel/dashboard/relevamiento/[id]/RelevamientoDashboardClient.tsx
"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = {
  edificios: "#6366F1",
  aulas: "#10B981",
  m2: "#F59E0B",
};

const CHART_CONSERV = {
  Bueno: "#22C55E",
  Regular: "#EAB308",
  Malo: "#EF4444",
};

type TooltipContentProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

const TooltipContent = ({ active, payload, label }: TooltipContentProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow">
      <div className="mb-1 font-medium text-gray-800">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-gray-700">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="capitalize">{p.name}:</span>{" "}
          <span className="font-medium">
            {typeof p.value === "number"
              ? p.dataKey === "m2"
                ? `${p.value.toLocaleString("es-AR")} m²`
                : p.value.toLocaleString("es-AR")
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ---------------------------
// Tipos RESUMEN (KPIs + gráficos)
// ---------------------------

type ByNivelItem = {
  nivel: string;
  edificios: number;
  aulas: number;
  m2: number;
};

type ConservRow = {
  clasificacion: "Bueno" | "Regular" | "Malo" | string;
  construcciones: number;
};

type NivelConservacionData = {
  nivel: string;
  Bueno: number;
  Regular: number;
  Malo: number;
};

type RawNivelConservRow = {
  nivel: string;
  conservacion: string;
  construcciones: number | string;
};

type DashboardResumenResponse = {
  relevamientoId: number;
  kpis: {
    edificios: number;
    aulas: number;
    m2: number;
  };
  byNivel: ByNivelItem[];
  construccionesPorConservacion: {
    items: ConservRow[];
    total: number;
  };
  edificiosPorNivelYConservacion: {
    items: RawNivelConservRow[];
    total: number;
  };
};

// ---------------------------
// Tipos DETALLE (bloque2 + bloque3)
// ---------------------------

type DetalleInfo = {
  cui: number;
  localidad: string;
  modalidad_nivel: string | null;
  relevamiento_id: number;
  instituciones: { id: number; nombre: string }[];
};

type Bloque2Row = {
  construccion_id: number;
  numero_construccion?: number | null;
  tipo: string;
  sub_tipo: string;
  categoria: string;
  estado: "Bueno" | "Regular" | "Malo" | null;
};

type Bloque3Row = {
  tipo_local: string;
  identificacion: string;
  estado_local: "Bueno" | "Regular" | "Malo" | "Sin datos";
  observaciones: string | null;
  score_local?: number;
  tieneCriticoMalo?: boolean;
};

type DetalleRelevamientoResponse = {
  info: DetalleInfo;
  bloque2: Bloque2Row[];
  bloque3: Bloque3Row[];
};

// ---------------------------
// Helpers para bloque2/bloque3
// ---------------------------

const estadoPillClass = (estado: string | null) => {
  if (estado === "Bueno") return "bg-green-100 text-green-700";
  if (estado === "Regular") return "bg-amber-100 text-amber-700";
  if (estado === "Malo") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-500";
};

const labelSubtipo = (tipo: string, sub: string) => {
  if (tipo === "servicio_agua") {
    if (sub === "provisión de agua") return "Provisión";
    if (sub === "almacenamiento agua") return "Almacenamiento";
  }
  if (tipo === "servicio_desague") return "Desagüe";
  if (tipo === "servicio_gas") return "Gas";
  if (tipo === "servicio_electricidad") return "Electricidad";
  if (tipo === "estructura_resistente") return `Estructura · ${sub}`;
  if (tipo === "techo") return `Techo · ${sub}`;
  if (tipo === "paredes_cerramientos") return `Paredes · ${sub}`;
  return sub || tipo;
};

function TablaServicio({
  titulo,
  rows,
  mostrarConteo = true,
}: {
  titulo: string;
  rows: Bloque2Row[];
  mostrarConteo?: boolean;
}) {
  if (!rows || rows.length === 0) return null;

  const grouped = (() => {
    const map = new Map<string, { row: Bloque2Row; count: number }>();

    for (const r of rows) {
      const key = [
        r.tipo || "",
        r.sub_tipo || "",
        r.categoria || "",
        r.estado || "",
      ].join("||");

      const current = map.get(key);
      if (current) {
        current.count += 1;
      } else {
        map.set(key, { row: r, count: 1 });
      }
    }

    return Array.from(map.values());
  })();

  const isElectricidad = rows.some((r) => r.tipo === "servicio_electricidad");
  const categoriaHeader = isElectricidad ? "Disponibilidad" : "Categoría";

  return (
    <div className="rounded-lg border bg-white print:break-inside-avoid print-avoid">
      <div className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
        {titulo}
      </div>

      <div className="overflow-x-auto print:overflow-visible">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                Aspecto
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                {categoriaHeader}
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                Estado
              </th>
              {mostrarConteo && (
                <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  Construcciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {grouped.map(({ row, count }, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">
                  {labelSubtipo(row.tipo, row.sub_tipo || "")}
                </td>
                <td className="px-3 py-2">{row.categoria || "—"}</td>
                <td className="px-3 py-2">
                  {row.estado ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${estadoPillClass(
                        row.estado
                      )}`}
                    >
                      {row.estado}
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-500">
                      No aplica / sin dato
                    </span>
                  )}
                </td>
                {mostrarConteo && <td className="px-3 py-2">{count}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------
// Componente principal
// ---------------------------

export default function RelevamientoDashboardClient({
  relevamientoId,
}: {
  relevamientoId: number;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const isAdmin = !!user?.roles?.includes("ADMIN");

  const [resumen, setResumen] = useState<DashboardResumenResponse | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [detalle, setDetalle] = useState<DetalleRelevamientoResponse | null>(
    null
  );
  const [loadingDetalle, setLoadingDetalle] = useState(true);
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);

  // Redirigir si no es admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAdmin, router]);

  // Fetch del resumen del relevamiento (KPIs + gráficos)
  useEffect(() => {
    if (!isAdmin || !relevamientoId) return;

    let cancelled = false;
    setLoadingData(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(
          `/api/dashboard/relevamiento/${relevamientoId}/resumen`,
          { credentials: "include" }
        );
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          setResumen(data);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Error al cargar el resumen");
          setResumen(null);
        }
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, relevamientoId]);

  // Fetch del detalle del relevamiento (info + bloque2 + bloque3)
  useEffect(() => {
    if (!isAdmin || !relevamientoId) return;

    let cancelled = false;
    setLoadingDetalle(true);
    setErrorDetalle(null);

    (async () => {
      try {
        const res = await fetch(
          `/api/dashboard/relevamiento/${relevamientoId}/detalle`,
          { credentials: "include" }
        );
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          setDetalle(data);
        }
      } catch (e: any) {
        if (!cancelled) {
          setErrorDetalle(e?.message ?? "Error al cargar el detalle");
          setDetalle(null);
        }
      } finally {
        if (!cancelled) setLoadingDetalle(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, relevamientoId]);

  // Derivados para gráficos

  const mergedByNivel = useMemo(() => {
    if (!resumen?.byNivel) return [];
    return [...resumen.byNivel].sort((a, b) => a.nivel.localeCompare(b.nivel));
  }, [resumen]);

  const totals = useMemo(() => {
    if (!resumen?.kpis) return { edificios: 0, aulas: 0, m2: 0 };
    return resumen.kpis;
  }, [resumen]);

  const conservacionConstruccionesSeries = useMemo(() => {
    const base: Record<
      "grupo" | "Bueno" | "Regular" | "Malo",
      string | number
    > = {
      grupo: "Conservación",
      Bueno: 0,
      Regular: 0,
      Malo: 0,
    };

    (resumen?.construccionesPorConservacion.items || []).forEach((r) => {
      const k = String(r.clasificacion || "").trim() as
        | "Bueno"
        | "Regular"
        | "Malo";
      if (k === "Bueno" || k === "Regular" || k === "Malo") {
        base[k] = Number(r.construcciones) || 0;
      }
    });

    return [base];
  }, [resumen]);

  const mergedByNivelAndConservacion = useMemo(() => {
    const data = resumen?.edificiosPorNivelYConservacion.items || [];
    if (!data.length) return [];

    const map = new Map<string, NivelConservacionData>();

    const baseRow = (nivel: string): NivelConservacionData => ({
      nivel,
      Bueno: 0,
      Regular: 0,
      Malo: 0,
    });

    for (const item of data) {
      const nivelKey = String(item.nivel ?? "SIN NIVEL");
      const rawConservacion = String(item.conservacion ?? "").trim();
      const count = Number(item.construcciones || 0);

      const currentRow = map.get(nivelKey) || baseRow(nivelKey);

      if (
        rawConservacion === "Bueno" ||
        rawConservacion === "Regular" ||
        rawConservacion === "Malo"
      ) {
        currentRow[rawConservacion] = count;
      }

      map.set(nivelKey, currentRow);
    }

    return Array.from(map.values()).sort((a, b) =>
      a.nivel.localeCompare(b.nivel)
    );
  }, [resumen]);

  const bloque2PorConstruccion = useMemo(() => {
    if (!detalle) return null;
    const rows = detalle.bloque2 || [];

    const map = new Map<
      number,
      {
        construccion_id: number;
        numero_construccion?: number | null;
        conservacion: Bloque2Row[];
        agua: Bloque2Row[];
        desague: Bloque2Row[];
        gas: Bloque2Row[];
        electricidad: Bloque2Row[];
      }
    >();

    for (const r of rows) {
      const id = r.construccion_id ?? 0;
      if (!id) continue;

      const current = map.get(id) || {
        construccion_id: id,
        numero_construccion: r.numero_construccion ?? null,
        conservacion: [],
        agua: [],
        desague: [],
        gas: [],
        electricidad: [],
      };

      if (r.numero_construccion != null) {
        current.numero_construccion = r.numero_construccion;
      }

      if (
        ["estructura_resistente", "techo", "paredes_cerramientos"].includes(
          r.tipo
        )
      ) {
        current.conservacion.push(r);
      } else if (r.tipo === "servicio_agua") {
        current.agua.push(r);
      } else if (r.tipo === "servicio_desague") {
        current.desague.push(r);
      } else if (r.tipo === "servicio_gas") {
        current.gas.push(r);
      } else if (r.tipo === "servicio_electricidad") {
        current.electricidad.push(r);
      }

      map.set(id, current);
    }

    return Array.from(map.values()).sort(
      (a, b) => a.construccion_id - b.construccion_id
    );
  }, [detalle]);

  if (!isAdmin && !loading) {
    return null;
  }

  // Aseguramos que el usuario no imprima antes de que carguen todos los datos
  const handlePrint = () => {
    if (loadingData || loadingDetalle || !resumen || !detalle) {
      alert("Esperá a que se carguen todos los datos antes de imprimir.");
      return;
    }

    // Un poco más de delay para que todo termine de pintarse
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <>
      {/* Reglas globales de impresión */}
      <style jsx global>{`
        @media print {
          .print-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .print-page-break {
            break-before: page;
            page-break-before: always;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 mt-8">
        <div className="mx-auto max-w-5xl px-4 pt-24 pb-10 print:max-w-none print:px-8 print:pt-8 print:pb-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between print:mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 print:text-2xl">
                Relevamiento N° {relevamientoId}
              </h1>
              <p className="text-sm text-gray-600">Resumen del relevamiento.</p>
            </div>

            {/* Botones (ocultamos en impresión) */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center print:hidden">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                ← Volver
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center rounded-md border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Imprimir / Guardar PDF
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* KPIs */}
          {resumen && (
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 print:mb-6">
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-5 shadow-sm print:rounded-md print:border print:border-gray-300 print:bg-white print:shadow-none overflow-hidden print-avoid">
                <div className="text-xs uppercase tracking-wide text-indigo-600">
                  Edificios
                </div>
                <div className="mt-2 text-3xl font-semibold text-gray-900 print:text-2xl">
                  {totals.edificios.toLocaleString("es-AR")}
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-5 shadow-sm print:rounded-md print:border print:border-gray-300 print:bg-white print:shadow-none overflow-hidden print-avoid">
                <div className="text-xs uppercase tracking-wide text-emerald-600">
                  Aulas
                </div>
                <div className="mt-2 text-3xl font-semibold text-gray-900 print:text-2xl">
                  {totals.aulas.toLocaleString("es-AR")}
                </div>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-5 shadow-sm print:rounded-md print:border print:border-gray-300 print:bg-white print:shadow-none overflow-hidden print-avoid">
                <div className="text-xs uppercase tracking-wide text-amber-600">
                  Metros cuadrados
                </div>
                <div className="mt-2 text-3xl font-semibold text-gray-900 print:text-2xl">
                  {totals.m2.toLocaleString("es-AR")}
                </div>
              </div>
            </div>
          )}

          {/* Gráficos */}
          {loadingData ? (
            <div className="text-gray-500">Cargando datos…</div>
          ) : !resumen ? (
            <div className="text-gray-500">
              Sin datos para este relevamiento.
            </div>
          ) : (
            <div className="space-y-8 print:space-y-6">
              {/* Edificios por nivel */}
              <section className="print-avoid">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 print:text-base">
                    Edificios por nivel
                  </h2>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm print:rounded-md print:shadow-none overflow-hidden print-avoid">
                  <div className="h-72 print:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mergedByNivel}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="nivel" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<TooltipContent />} />
                        <Legend />
                        <Bar
                          dataKey="edificios"
                          name="Edificios"
                          radius={[6, 6, 0, 0]}
                          fill={CHART_COLORS.edificios}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* Aulas por nivel */}
              <section className="print-avoid">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 print:text-base">
                    Aulas por nivel
                  </h2>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm print:rounded-md print:shadow-none overflow-hidden print-avoid">
                  <div className="h-72 print:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mergedByNivel}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="nivel" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<TooltipContent />} />
                        <Legend />
                        <Bar
                          dataKey="aulas"
                          name="Aulas"
                          radius={[6, 6, 0, 0]}
                          fill={CHART_COLORS.aulas}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* m2 por nivel */}
              <section className="print-avoid">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 print:text-base">
                    Metros cuadrados por nivel
                  </h2>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm print:rounded-md print:shadow-none overflow-hidden print-avoid">
                  <div className="h-72 print:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mergedByNivel}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="nivel" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<TooltipContent />} />
                        <Legend />
                        <Bar
                          dataKey="m2"
                          name="m²"
                          radius={[6, 6, 0, 0]}
                          fill={CHART_COLORS.m2}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* Construcciones por nivel de conservación */}
              <section className="print-avoid">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 print:text-base">
                    Construcciones por nivel de conservación
                  </h2>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm print:rounded-md print:shadow-none overflow-hidden print-avoid">
                  <div className="h-72 print:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={conservacionConstruccionesSeries}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="grupo" tick={{ fontSize: 12 }} />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          allowDecimals={false}
                        />
                        <Tooltip content={<TooltipContent />} />
                        <Legend />
                        <Bar
                          dataKey="Bueno"
                          name="Bueno"
                          radius={[6, 6, 0, 0]}
                          fill={CHART_CONSERV.Bueno}
                        />
                        <Bar
                          dataKey="Regular"
                          name="Regular"
                          radius={[6, 6, 0, 0]}
                          fill={CHART_CONSERV.Regular}
                        />
                        <Bar
                          dataKey="Malo"
                          name="Malo"
                          radius={[6, 6, 0, 0]}
                          fill={CHART_CONSERV.Malo}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* Edificios por nivel educativo y estado de conservación */}
              <section className="print-avoid">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 print:text-base">
                    Edificios por nivel educativo y estado de conservación
                  </h2>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm print:rounded-md print:shadow-none overflow-hidden print-avoid">
                  <div className="h-72 print:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mergedByNivelAndConservacion}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="nivel" tick={{ fontSize: 12 }} />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          allowDecimals={false}
                        />
                        <Tooltip content={<TooltipContent />} />
                        <Legend />
                        <Bar
                          dataKey="Bueno"
                          name="Bueno"
                          stackId="a"
                          radius={[6, 6, 0, 0]}
                          fill={CHART_CONSERV.Bueno}
                        />
                        <Bar
                          dataKey="Regular"
                          name="Regular"
                          stackId="a"
                          fill={CHART_CONSERV.Regular}
                        />
                        <Bar
                          dataKey="Malo"
                          name="Malo"
                          stackId="a"
                          fill={CHART_CONSERV.Malo}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Detalle: info + bloque2 + bloque3 */}
          <div className="mt-10 space-y-8 print:mt-8 print:space-y-6">
            {errorDetalle && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorDetalle}
              </div>
            )}

            {loadingDetalle ? (
              <div className="text-gray-500">Cargando detalle…</div>
            ) : !detalle ? (
              <div className="text-gray-500">
                Sin detalle para este relevamiento.
              </div>
            ) : (
              <>
                {/* Ficha del establecimiento */}
                <section className="print-page-break print-avoid">
                  <h2 className="mb-2 text-lg font-semibold text-gray-900 print:text-base">
                    Ficha del establecimiento
                  </h2>
                  <div className="rounded-lg border bg-white p-4 print-avoid">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm print:text-xs">
                      <div>
                        <span className="text-gray-500">
                          Relevamiento ID:
                        </span>{" "}
                        <span className="font-medium">
                          {detalle.info.relevamiento_id}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">CUI:</span>{" "}
                        <span className="font-medium">{detalle.info.cui}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Localidad:</span>{" "}
                        <span className="font-medium">
                          {detalle.info.localidad || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Nivel:</span>{" "}
                        <span className="font-medium">
                          {detalle.info.modalidad_nivel || "SIN NIVEL"}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-gray-500">
                          Instituciones (dedup por CUI):
                        </span>
                        <ul className="mt-1 list-inside list-disc">
                          {detalle.info.instituciones.map((i) => (
                            <li key={i.id} className="font-medium">
                              {i.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Bloque 2 · Conservación + servicios por construcción */}
                <section>
                  <h2 className="mb-2 text-lg font-semibold text-gray-900 print:text-base">
                    Bloque 2 · Conservación y servicios por construcción
                  </h2>

                  {!bloque2PorConstruccion ||
                  bloque2PorConstruccion.length === 0 ? (
                    <div className="text-xs text-gray-500">Sin datos.</div>
                  ) : (
                    <div className="space-y-6">
                      {bloque2PorConstruccion.map((c) => (
                        <div
                          key={c.construccion_id}
                          className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 print:bg-white print-avoid"
                        >
                          <div className="mb-2 text-xs font-semibold text-gray-700">
                            Construcción N°{" "}
                            {c.numero_construccion != null
                              ? c.numero_construccion
                              : c.construccion_id}
                          </div>

                          <div className="space-y-3">
                            {c.conservacion.length > 0 && (
                              <TablaServicio
                                titulo="Conservación de la construcción"
                                rows={c.conservacion}
                                mostrarConteo={false}
                              />
                            )}

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              {c.agua.length > 0 && (
                                <TablaServicio
                                  titulo="Agua"
                                  rows={c.agua}
                                  mostrarConteo={false}
                                />
                              )}
                              {c.desague.length > 0 && (
                                <TablaServicio
                                  titulo="Desagües cloacales"
                                  rows={c.desague}
                                  mostrarConteo={false}
                                />
                              )}
                              {c.gas.length > 0 && (
                                <TablaServicio
                                  titulo="Gas"
                                  rows={c.gas}
                                  mostrarConteo={false}
                                />
                              )}
                              {c.electricidad.length > 0 && (
                                <TablaServicio
                                  titulo="Electricidad"
                                  rows={c.electricidad}
                                  mostrarConteo={false}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Bloque 3 · Locales */}
                <section className="print-avoid">
                  <h2 className="mb-2 text-lg font-semibold text-gray-900 print:text-base">
                    Bloque 3 · Locales con detalle
                  </h2>
                  <div className="overflow-x-auto rounded-lg border bg-white print:overflow-visible print-avoid">
                    <table className="min-w-full text-sm print:text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Tipo de local
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Identificación
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Estado
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Observaciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {detalle.bloque3.length === 0 ? (
                          <tr>
                            <td
                              className="px-3 py-2 text-gray-500"
                              colSpan={4}
                            >
                              Sin datos
                            </td>
                          </tr>
                        ) : (
                          detalle.bloque3.map((r, idx) => (
                            <tr
                              key={`${r.tipo_local}-${idx}`}
                              className="border-t align-top"
                            >
                              <td className="px-3 py-2">{r.tipo_local}</td>
                              <td className="px-3 py-2">
                                {r.identificacion}
                              </td>
                              <td className="px-3 py-2">
                                {r.estado_local === "Bueno" ||
                                r.estado_local === "Regular" ||
                                r.estado_local === "Malo" ? (
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                      r.estado_local === "Bueno"
                                        ? "bg-green-100 text-green-700"
                                        : r.estado_local === "Regular"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {r.estado_local}
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                    Sin datos
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 whitespace-pre-wrap">
                                {r.observaciones ?? (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
