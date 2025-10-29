"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
// Si estás usando recharts, importa aquí; si no, tu SimpleBarChart
import {
  Bar,
  BarChart,
  CartesianGrid, Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from "recharts";

const CHART_COLORS = {
  edificios: "#6366F1", // indigo-500
  aulas: "#10B981",     // emerald-500
  m2: "#F59E0B",        // amber-500
};

const TooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow">
      <div className="font-medium text-gray-800 mb-1">{label}</div>
      {payload.map((p: any) => (
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


type ItemKpi = { nivel: string; edificios?: number; aulas?: number; m2?: number };

export default function AdminDashboardPage() {
  // 1) HOOKS SIEMPRE EN EL MISMO ORDEN
  const { user, loading } = useUser();
  const router = useRouter();

  const [localidades, setLocalidades] = useState<string[]>([]);
  const [localidad, setLocalidad] = useState<string>("");

  const [edificios, setEdificios] = useState<ItemKpi[]>([]);
  const [aulas, setAulas] = useState<ItemKpi[]>([]);
  const [m2, setM2] = useState<ItemKpi[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const isAdmin = !!user?.roles?.includes("ADMIN");

  // 2) EFECTOS — NUNCA CONDICIONALES; HACEN GUARD DENTRO
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
        const res = await fetch("/api/dashboard/localidades", { credentials: "include" });
        const data = await res.json();
        if (!cancelled) setLocalidades(data.items || []);
      } catch {
        if (!cancelled) setLocalidades([]);
      }
    })();
    return () => { cancelled = true; };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    const q = localidad ? `?localidad=${encodeURIComponent(localidad)}` : "";
    setLoadingData(true);
    Promise.all([
      fetch(`/api/dashboard/edificios-por-nivel${q}`, { credentials: "include" }).then(r => r.json()),
      fetch(`/api/dashboard/aulas-por-nivel${q}`, { credentials: "include" }).then(r => r.json()),
      fetch(`/api/dashboard/metros2-por-nivel${q}`, { credentials: "include" }).then(r => r.json()),
    ])
      .then(([E, A, M]) => {
        if (cancelled) return;
        setEdificios(E.items || []);
        setAulas(A.items || []);
        setM2(M.items || []);
      })
      .finally(() => {
        if (!cancelled) setLoadingData(false);
      });
    return () => { cancelled = true; };
  }, [isAdmin, localidad]);

  // 3) MEMOS — SIEMPRE SE LLAMAN, AUNQUE ESTÉ VACÍO
  const mergedByNivel = useMemo(() => {
    const map = new Map<string, ItemKpi>();
    const add = (arr: any[], key: keyof ItemKpi) => {
      (arr || []).forEach((i: any) => {
        const k = i.nivel ?? "SIN NIVEL";
        const prev = map.get(k) || { nivel: k, edificios: 0, aulas: 0, m2: 0 };
        (prev as any)[key] =
          Number(i[key]) || Number(i.edificios) || Number(i.aulas) || Number(i.m2) || 0;
        map.set(k, prev);
      });
    };
    add(edificios, "edificios");
    add(aulas, "aulas");
    add(m2, "m2");
    return Array.from(map.values()).sort((a, b) => a.nivel.localeCompare(b.nivel));
  }, [edificios, aulas, m2]);

  const totals = useMemo(() => {
    return mergedByNivel.reduce(
      (acc, x) => ({
        edificios: acc.edificios + (x.edificios || 0),
        aulas: acc.aulas + (x.aulas || 0),
        m2: acc.m2 + (x.m2 || 0),
      }),
      { edificios: 0, aulas: 0, m2: 0 }
    );
  }, [mergedByNivel]);

  // 4) RENDER ÚNICO — SIN RETURNS TEMPRANOS
  return (
  <div className="min-h-screen bg-gray-50 mt-8">
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard · La Pampa
        </h1>

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
      </div>

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-indigo-600">Edificios</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            {totals.edificios.toLocaleString("es-AR")}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-emerald-600">Aulas</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            {totals.aulas.toLocaleString("es-AR")}
          </div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-amber-600">Metros cuadrados</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            {totals.m2.toLocaleString("es-AR")}
          </div>
        </div>
      </div>

      {/* Contenido */}
      {loadingData ? (
        <div className="text-gray-500">Cargando datos…</div>
      ) : (
        <div className="space-y-8">
          {/* Edificios */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Edificios por nivel</h2>
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
                    <Bar dataKey="edificios" name="Edificios" radius={[6, 6, 0, 0]} fill={CHART_COLORS.edificios} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Aulas */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Aulas por nivel</h2>
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
                    <Bar dataKey="aulas" name="Aulas" radius={[6, 6, 0, 0]} fill={CHART_COLORS.aulas} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* m² */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Metros cuadrados por nivel</h2>
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
                    <Bar dataKey="m2" name="m²" radius={[6, 6, 0, 0]} fill={CHART_COLORS.m2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  </div>
);

}
