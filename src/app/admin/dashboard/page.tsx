"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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

type ItemKpi = {
  nivel: string;
  edificios?: number;
  aulas?: number;
  m2?: number;
};
type ConservacionRow = {
  clasificacion: "Bueno" | "Regular" | "Malo";
  construcciones: number;
};
type Establecimiento = {
  cui: number;
  etiqueta: string;
  localidad: string;
  modalidad_nivel: string | null;
};

type ResumenEstInfo = {
  cui: number;
  localidad: string;
  modalidad_nivel: string | null;
  instituciones: { id: number; nombre: string }[];
};
type ResumenEst = {
  info: ResumenEstInfo;
  bloque2: {
    tipo: string;
    sub_tipo: string;
    categoria: string;
    estado: "Bueno" | "Regular" | "Malo";
  }[];
  bloque3: {
    tipo_local: string;
    identificacion: string;
    estado_local: "Bueno" | "Regular" | "Malo" | null;
    observaciones: string | null;
  }[];
};

export default function AdminDashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [localidades, setLocalidades] = useState<string[]>([]);
  const [localidad, setLocalidad] = useState<string>("");

  const [edificios, setEdificios] = useState<ItemKpi[]>([]);
  const [aulas, setAulas] = useState<ItemKpi[]>([]);
  const [m2, setM2] = useState<ItemKpi[]>([]);
  const [conservacionConstrucciones, setConservacionConstrucciones] = useState<
    ConservacionRow[]
  >([]);
  const [loadingData, setLoadingData] = useState(true);

  // búsqueda de establecimientos
  const [q, setQ] = useState<string>("");
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>(
    []
  );
  const [selCui, setSelCui] = useState<number | null>(null);
  const [loadingEst, setLoadingEst] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [openResumen, setOpenResumen] = useState(false);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [resumen, setResumen] = useState<ResumenEst | null>(null);

  const isAdmin = !!user?.roles?.includes("ADMIN");

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard/localidades", {
          credentials: "include",
        });
        const data = await res.json();
        if (!cancelled) setLocalidades(data.items || []);
      } catch {
        if (!cancelled) setLocalidades([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    const qParam = localidad
      ? `?localidad=${encodeURIComponent(localidad)}`
      : "";
    setLoadingData(true);

    Promise.all([
      fetch(`/api/dashboard/edificios-por-nivel${qParam}`, {
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`/api/dashboard/aulas-por-nivel${qParam}`, {
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`/api/dashboard/metros2-por-nivel${qParam}`, {
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`/api/dashboard/escuelas-por-conservacion${qParam}`, {
        credentials: "include",
      }).then((r) => r.json()),
    ])
      .then(([E, A, M, C]) => {
        if (cancelled) return;
        setEdificios(E.items || []);
        setAulas(A.items || []);
        setM2(M.items || []);
        setConservacionConstrucciones(
          (C.items || []).map((x: any) => ({
            clasificacion: String(
              x.clasificacion
            ) as ConservacionRow["clasificacion"],
            construcciones: Number(x.construcciones || 0),
          }))
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingData(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAdmin, localidad]);

  // Debounced fetch de establecimientos (por nombre, dedup por CUI)
  useEffect(() => {
    if (!isAdmin) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setLoadingEst(true);
        const params = new URLSearchParams();
        if (localidad) params.set("localidad", localidad);
        if (q.trim()) params.set("q", q.trim());
        params.set("limit", "50");

        const res = await fetch(
          `/api/dashboard/establecimientos?${params.toString()}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setEstablecimientos(data.items || []);
      } catch {
        setEstablecimientos([]);
      } finally {
        setLoadingEst(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [isAdmin, localidad, q]);

  const mergedByNivel = useMemo(() => {
    const map = new Map<string, ItemKpi>();
    const add = (arr: any[], key: keyof ItemKpi) => {
      (arr || []).forEach((i: any) => {
        const k = i.nivel ?? "SIN NIVEL";
        const prev = map.get(k) || { nivel: k, edificios: 0, aulas: 0, m2: 0 };
        (prev as any)[key] =
          Number(i[key]) ||
          Number(i.edificios) ||
          Number(i.aulas) ||
          Number(i.m2) ||
          0;
        map.set(k, prev);
      });
    };
    add(edificios, "edificios");
    add(aulas, "aulas");
    add(m2, "m2");
    return Array.from(map.values()).sort((a, b) =>
      a.nivel.localeCompare(b.nivel)
    );
  }, [edificios, aulas, m2]);

  const totals = useMemo(() => {
    return mergedByNivel.reduce(
      (acc: { edificios: number; aulas: number; m2: number }, x) => ({
        edificios: acc.edificios + (x.edificios || 0),
        aulas: acc.aulas + (x.aulas || 0),
        m2: acc.m2 + (x.m2 || 0),
      }),
      { edificios: 0, aulas: 0, m2: 0 }
    );
  }, [mergedByNivel]);

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
    (conservacionConstrucciones || []).forEach((r) => {
      const k = (r.clasificacion || "").trim() as "Bueno" | "Regular" | "Malo";
      if (k === "Bueno" || k === "Regular" || k === "Malo") {
        base[k] = Number(r.construcciones) || 0;
      }
    });
    return [base];
  }, [conservacionConstrucciones]);

  return (
    <div className="min-h-screen bg-gray-50 mt-8">
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard · La Pampa
          </h1>

          <div className="flex flex-col gap-2 md:flex-row md:items-end">
            {/* Filtro Localidad */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Localidad</label>
              <select
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
              >
                <option value="">Todas</option>
                {localidades.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Buscador de Establecimientos */}
            <div className="w-full md:w-96">
              <label className="text-sm text-gray-600">
                Buscar establecimiento
              </label>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Escribí el nombre de la institución…"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {loadingEst ? (
                <div className="mt-1 text-xs text-gray-500">Buscando…</div>
              ) : (
                <>
                  {q && establecimientos.length === 0 ? (
                    <div className="mt-1 text-xs text-gray-500">
                      Sin resultados
                    </div>
                  ) : null}

                  {establecimientos.length > 0 && (
                    <ul className="mt-1 max-h-64 overflow-auto rounded-md border border-gray-200 bg-white shadow-sm">
                      {establecimientos.map((e) => (
                        <li
                          key={e.cui}
                          className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-gray-50 ${
                            selCui === e.cui ? "bg-indigo-50" : ""
                          }`}
                          onClick={() => setSelCui(e.cui)}
                          title={`Seleccionar ${e.etiqueta}`}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">
                              {e.etiqueta}
                            </span>
                            <span className="text-xs text-gray-500">
                              {e.localidad} · {e.modalidad_nivel || "SIN NIVEL"}{" "}
                              · CUI {e.cui}
                            </span>
                          </div>
                          {selCui === e.cui && (
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                              Seleccionado
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-300 disabled:text-gray-600"
                      disabled={!selCui}
                      onClick={async () => {
                        if (!selCui) return;
                        try {
                          setLoadingResumen(true);
                          setOpenResumen(true);
                          const params = new URLSearchParams();
                          params.set("cui", String(selCui));
                          const res = await fetch(
                            `/api/dashboard/resumen-establecimiento?${params.toString()}`,
                            {
                              credentials: "include",
                            }
                          );
                          const data = await res.json();
                          setResumen(data);
                        } catch (e) {
                          setResumen(null);
                        } finally {
                          setLoadingResumen(false);
                        }
                      }}
                    >
                      Ver resumen del establecimiento
                    </button>
                    {selCui && (
                      <button
                        className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setSelCui(null)}
                      >
                        Limpiar selección
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-indigo-600">
              Edificios
            </div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {totals.edificios.toLocaleString("es-AR")}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-emerald-600">
              Aulas
            </div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {totals.aulas.toLocaleString("es-AR")}
            </div>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-amber-600">
              Metros cuadrados
            </div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {totals.m2.toLocaleString("es-AR")}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        {loadingData ? (
          <div className="text-gray-500">Cargando datos…</div>
        ) : (
          <div className="space-y-8">
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Edificios por nivel
                </h2>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="h-72">
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

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Aulas por nivel
                </h2>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="h-72">
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

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Metros cuadrados por nivel
                </h2>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="h-72">
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

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Construcciones por nivel de conservación
                </h2>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conservacionConstruccionesSeries}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="grupo" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
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

            {/* Drawer lateral */}
            <div
              className={`fixed inset-y-0 right-0 z-50 w-full max-w-3xl transform bg-white shadow-2xl transition-transform duration-300 ${
                openResumen ? "translate-x-0" : "translate-x-full"
              }`}
              aria-hidden={!openResumen}
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Resumen del establecimiento
                  </h3>
                  <button
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                    onClick={() => setOpenResumen(false)}
                  >
                    Cerrar
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto p-5">
                  {loadingResumen ? (
                    <div className="text-gray-500">Cargando resumen…</div>
                  ) : !resumen ? (
                    <div className="text-gray-500">Sin datos</div>
                  ) : (
                    <div className="space-y-8">
                      {/* Ficha */}
                      <section>
                        <h4 className="mb-2 text-sm font-semibold text-gray-700">
                          Ficha
                        </h4>
                        <div className="rounded-lg border p-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">CUI:</span>{" "}
                              <span className="font-medium">
                                {resumen.info.cui}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Localidad:</span>{" "}
                              <span className="font-medium">
                                {resumen.info.localidad || "-"}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500">Nivel:</span>{" "}
                              <span className="font-medium">
                                {resumen.info.modalidad_nivel || "SIN NIVEL"}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500">
                                Instituciones (dedup por CUI):
                              </span>
                              <ul className="mt-1 list-inside list-disc">
                                {resumen.info.instituciones.map((i) => (
                                  <li key={i.id} className="font-medium">
                                    {i.nombre}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Bloque 2 */}
                      <section>
                        <h4 className="mb-2 text-sm font-semibold text-gray-700">
                          Bloque 2 · Preguntas 3–6
                        </h4>
                        <div className="overflow-hidden rounded-lg border">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium text-gray-700">
                                  Tipo
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-gray-700">
                                  Categoría
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-gray-700">
                                  Estado
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {resumen.bloque2.length === 0 ? (
                                <tr>
                                  <td
                                    className="px-3 py-2 text-gray-500"
                                    colSpan={4}
                                  >
                                    Sin datos
                                  </td>
                                </tr>
                              ) : (
                                resumen.bloque2.map((r, idx) => (
                                  <tr key={idx} className="border-t">
                                    <td className="px-3 py-2">{r.sub_tipo}</td>
                                    <td className="px-3 py-2">{r.categoria}</td>
                                    <td className="px-3 py-2">
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                          r.estado === "Bueno"
                                            ? "bg-green-100 text-green-700"
                                            : r.estado === "Regular"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {r.estado}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </section>

                      {/* Bloque 3 */}
                      <section>
                        <h4 className="mb-2 text-sm font-semibold text-gray-700">
                          Bloque 3 · Locales con detalle
                        </h4>
                        <div className="overflow-hidden rounded-lg border">
                          <table className="min-w-full text-sm">
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
                              {resumen.bloque3.length === 0 ? (
                                <tr>
                                  <td
                                    className="px-3 py-2 text-gray-500"
                                    colSpan={4}
                                  >
                                    Sin datos
                                  </td>
                                </tr>
                              ) : (
                                resumen.bloque3
                                  // Si querés mostrar solo Regular/Malo, descomentá el filter:
                                  // .filter((r) => r.estado_local === "Regular" || r.estado_local === "Malo")
                                  .map((r, idx) => (
                                    <tr
                                      key={`${r.tipo_local}-${idx}`}
                                      className="border-t align-top"
                                    >
                                      <td className="px-3 py-2">
                                        {r.tipo_local}
                                      </td>
                                      <td className="px-3 py-2">
                                        {r.identificacion}
                                      </td>
                                      <td className="px-3 py-2">
                                        {r.estado_local ? (
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
                                          <span className="text-xs text-gray-500">
                                            —
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-3 py-2 whitespace-pre-wrap">
                                        {r.observaciones ?? (
                                          <span className="text-gray-400">
                                            —
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Backdrop */}
            {openResumen && (
              <div
                className="fixed inset-0 z-40 bg-black/20"
                onClick={() => setOpenResumen(false)}
                aria-hidden
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
