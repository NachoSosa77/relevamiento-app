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

type Bloque2Row = {
  construccion_id?: number;
  numero_construccion?: number; // 👈 NUEVO
  tipo: string;
  sub_tipo: string;
  categoria: string;
  estado: "Bueno" | "Regular" | "Malo" | null;
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

type ConstruccionEstadoItem = {
  construccionId: number;
  numero_construccion?: number | null;
  clasificacion: "Bueno" | "Regular" | "Malo";
  score?: number | null;
};

type ResumenEstInfo = {
  cui: number;
  localidad: string;
  modalidad_nivel: string | null;
  instituciones: { id: number; nombre: string }[];
  relevamiento_id: number;
};
type ResumenEst = {
  info: ResumenEstInfo;
  bloque2: Bloque2Row[];
  bloque3: {
    tipo_local: string;
    identificacion: string;
    estado_local: "Bueno" | "Regular" | "Malo" | null;
    observaciones: string | null;
    score_local?: number;
    tieneCriticoMalo?: boolean;
  }[];
};

// Define el tipo esperado para la salida del useMemo
type NivelConservacionData = {
  nivel: string;
  Bueno: number;
  Regular: number;
  Malo: number;
  // Puedes agregar un total aquí si lo necesitas en el Tooltip
  // totalConstrucciones: number;
};

// Define el tipo de los datos de entrada (opcional, pero buena práctica)
// Asumiendo que `edificiosPorNivelYConservacion` contiene objetos con estas claves
type RawConservacionRow = {
  nivel: string;
  conservacion: "Bueno" | "Regular" | "Malo" | string;
  construcciones: string | number;
};

type DrillItem = {
  relevamiento_id: number;
  cui: number;
  cues?: string | null; // si lo devolvés concatenado
  instituciones?: string | null; // si lo devolvés concatenado
  construcciones?: number; // MUY recomendado para alinear con el gráfico
  construccion_id?: number; // para linkear a la construcción
};

const estadoPillClass = (estado: string | null) => {
  if (estado === "Bueno") return "bg-green-100 text-green-700";
  if (estado === "Regular") return "bg-amber-100 text-amber-700";
  if (estado === "Malo") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-500";
};

const labelSubtipo = (tipo: string, sub: string) => {
  // Podés tunear estos labels a gusto
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
  mostrarConteo = true, // 👈 por defecto true, pero por construcción lo vamos a usar en false
}: {
  titulo: string;
  rows: Bloque2Row[];
  mostrarConteo?: boolean;
}) {
  if (!rows || rows.length === 0) return null;

  // Agrupamos por tipo + sub_tipo + categoria + estado
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

  // 👉 NUEVO: si alguno de los rows es electricidad, cambiamos el header
  const isElectricidad = rows.some((r) => r.tipo === "servicio_electricidad");
  const categoriaHeader = isElectricidad ? "Disponibilidad" : "Categoría";

  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
        {titulo}
      </div>

      <div className="overflow-x-auto">
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
  const [edificiosPorNivelYConservacion, setEdificiosPorNivelYConservacion] =
    useState<RawConservacionRow[]>([]);
  const [resumenRelevado, setResumenRelevado] = useState<{
    cuis: number;
    cues: number;
  }>({
    cuis: 0,
    cues: 0,
  });
  const [loadingData, setLoadingData] = useState(true);
  const [estadoConstruccionSel, setEstadoConstruccionSel] = useState<
    "Bueno" | "Regular" | "Malo"
  >("Regular");

  const [construccionesPorEstado, setConstruccionesPorEstado] = useState<
    ConstruccionEstadoItem[]
  >([]);
  const [loadingConstruccionesPorEstado, setLoadingConstruccionesPorEstado] =
    useState(false);

  // búsqueda de establecimientos
  const [openResumen, setOpenResumen] = useState(false);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [resumen, setResumen] = useState<ResumenEst | null>(null);

  // filtros cascada CUI/CUE
  const [cuisFiltro, setCuisFiltro] = useState<number[]>([]);
  const [cuesFiltro, setCuesFiltro] = useState<number[]>([]);
  const [selCuiFiltro, setSelCuiFiltro] = useState<number | "">("");
  const [selCueFiltro, setSelCueFiltro] = useState<number | "">("");
  const [loadingCuis, setLoadingCuis] = useState(false);
  const [loadingCues, setLoadingCues] = useState(false);

  // filtros establacientos nivel
  const [drillNivel, setDrillNivel] = useState<string>("");
  const [drillEstado, setDrillEstado] = useState<
    "" | "Bueno" | "Regular" | "Malo"
  >("");
  const [drillItems, setDrillItems] = useState<DrillItem[]>([]);
  const [loadingDrill, setLoadingDrill] = useState(false);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const isAdmin = !!user?.roles?.includes("ADMIN");

  const fetchDrilldown = async (
    nivel: string,
    estado: "Bueno" | "Regular" | "Malo"
  ) => {
    setLoadingDrill(true);
    try {
      const params = new URLSearchParams();
      if (localidad) params.set("localidad", localidad);
      params.set("nivel", nivel);
      params.set("conservacion", estado);
      params.set("limit", "100");

      const res = await fetch(
        `/api/dashboard/establecimientos-por-nivel-y-conservacion?${params.toString()}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();

      setDrillNivel(nivel);
      setDrillEstado(estado);
      setDrillItems(data.items || []);
    } finally {
      setLoadingDrill(false);
    }
  };

  // 1) Cargar CUIs disponibles (según localidad)
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    (async () => {
      try {
        setLoadingCuis(true);
        const params = new URLSearchParams();
        if (localidad) params.set("localidad", localidad);

        const res = await fetch(
          `/api/dashboard/filtros/cuis?${params.toString()}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!cancelled) {
          const items = (data.items || [])
            .map((x: any) => Number(x))
            .filter((n: number) => !Number.isNaN(n));

          setCuisFiltro(items);

          // reset cascada
          setSelCuiFiltro("");
          setSelCueFiltro("");
          setCuesFiltro([]);
        }
      } catch {
        if (!cancelled) {
          setCuisFiltro([]);
          setSelCuiFiltro("");
          setSelCueFiltro("");
          setCuesFiltro([]);
        }
      } finally {
        if (!cancelled) setLoadingCuis(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, localidad]);

  // 2) Cargar CUEs del CUI seleccionado (según localidad + CUI)
  useEffect(() => {
    if (!isAdmin) return;

    if (!selCuiFiltro) {
      setCuesFiltro([]);
      setSelCueFiltro("");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoadingCues(true);
        const params = new URLSearchParams();
        if (localidad) params.set("localidad", localidad);
        params.set("cui", String(selCuiFiltro));

        const res = await fetch(
          `/api/dashboard/filtros/cues?${params.toString()}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!cancelled) {
          const items = (data.items || [])
            .map((x: any) => Number(x))
            .filter((n: number) => !Number.isNaN(n));

          setCuesFiltro(items);
          setSelCueFiltro(""); // reset cue al cambiar cui
        }
      } catch {
        if (!cancelled) {
          setCuesFiltro([]);
          setSelCueFiltro("");
        }
      } finally {
        if (!cancelled) setLoadingCues(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, localidad, selCuiFiltro]);

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
    const params = new URLSearchParams();
    if (localidad) params.set("localidad", localidad);
    if (selCuiFiltro) params.set("cui", String(selCuiFiltro));
    if (selCueFiltro) params.set("cue", String(selCueFiltro));
    const qParam = params.toString() ? `?${params.toString()}` : "";
    setLoadingData(true);

    Promise.all([
      fetch(`/api/dashboard/resumen-relevado${qParam}`, {
        credentials: "include",
      }).then((r) => r.json()),
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
      fetch(`/api/dashboard/edificios-por-nivel-y-conservacion${qParam}`, {
        credentials: "include",
      }).then((r) => r.json()),
    ])
      .then(([R, E, A, M, C, D]) => {
        if (cancelled) return;

        setResumenRelevado({
          cuis: Number(R?.cuis || 0),
          cues: Number(R?.cues || 0),
        });

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
        setEdificiosPorNivelYConservacion(D.items || []);
      })
      .finally(() => {
        if (!cancelled) setLoadingData(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAdmin, localidad, selCuiFiltro, selCueFiltro]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    (async () => {
      try {
        setLoadingConstruccionesPorEstado(true);

        const params = new URLSearchParams();
        if (localidad) params.set("localidad", localidad);
        if (selCuiFiltro) params.set("cui", String(selCuiFiltro));
        if (selCueFiltro) params.set("cue", String(selCueFiltro));
        params.set("estado", estadoConstruccionSel);

        const res = await fetch(
          `/api/dashboard/escuelas-por-conservacion?${params.toString()}`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (!cancelled) setConstruccionesPorEstado(data.items || []);
      } catch {
        if (!cancelled) setConstruccionesPorEstado([]);
      } finally {
        if (!cancelled) setLoadingConstruccionesPorEstado(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, localidad, selCuiFiltro, selCueFiltro, estadoConstruccionSel]);

  // Debounced fetch de establecimientos (por nombre, dedup por CUI)

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

  const bloque2PorServicio = useMemo(() => {
    if (!resumen) return null;
    const rows = resumen.bloque2 || [];

    const map = new Map<
      number,
      {
        construccion_id: number;
        numero_construccion?: number | null; // 👈 NUEVO
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
        numero_construccion: r.numero_construccion ?? null, // 👈 guardamos el número
        conservacion: [],
        agua: [],
        desague: [],
        gas: [],
        electricidad: [],
      };

      // en caso de que venga luego otro row de la misma construcción con el número seteado,
      // reforzamos:
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

    const porConstruccion = Array.from(map.values()).sort(
      (a, b) => a.construccion_id - b.construccion_id
    );

    return { porConstruccion };
  }, [resumen]);

  const mergedByNivelAndConservacion = useMemo(() => {
    // Utilizamos la dependencia del nuevo estado
    const data: RawConservacionRow[] = edificiosPorNivelYConservacion;
    if (!data || data.length === 0) return [];

    // Mapa para agrupar las filas por 'nivel'
    const map = new Map<string, NivelConservacionData>();

    // Función base para una fila
    const baseRow = (nivel: string): NivelConservacionData => ({
      nivel,
      Bueno: 0,
      Regular: 0,
      Malo: 0,
    });

    for (const item of data) {
      // 1. Normalización de claves
      const nivelKey = String(item.nivel ?? "SIN NIVEL");
      const rawConservacion = String(item.conservacion ?? "").trim();
      const count = Number(item.construcciones || 0);

      // 2. Obtener o inicializar la fila para este nivel
      const currentRow = map.get(nivelKey) || baseRow(nivelKey);

      // 3. Asignar el conteo
      // Solo asignamos si la clasificación es uno de los estados esperados
      if (
        rawConservacion === "Bueno" ||
        rawConservacion === "Regular" ||
        rawConservacion === "Malo"
      ) {
        currentRow[rawConservacion] = count;
      }

      map.set(nivelKey, currentRow);
    }

    // 4. Convertir el mapa de nuevo a un array y ordenar por el nombre del nivel
    const result = Array.from(map.values()).sort((a, b) =>
      a.nivel.localeCompare(b.nivel)
    );

    return result;
  }, [edificiosPorNivelYConservacion]);

  return (
    <div className="min-h-screen bg-gray-50 mt-8">
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Título + resumen solo-impresión */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard · La Pampa
            </h1>
            {/* Solo se ve al imprimir: Localidad seleccionada o 'Todas' */}
            <p className="hidden print:block mt-1 text-sm text-gray-700">
              Localidad: {localidad || "Todas"}
            </p>
          </div>

          {/* Filtros y buscador: ocultos en impresión */}
          <div className="flex flex-col gap-2 md:flex-row md:items-end print:hidden">
            {/* Botón Imprimir */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 print:hidden"
            >
              Imprimir / Guardar PDF
            </button>
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

            {/* Filtros CUI / CUE */}
            <div className="flex flex-col gap-2 md:flex-row md:items-end">
              {/* CUI */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">CUI</label>
                <select
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
                  value={selCuiFiltro}
                  onChange={(e) =>
                    setSelCuiFiltro(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  disabled={loadingCuis}
                >
                  <option value="">
                    {loadingCuis ? "Cargando..." : "Todos"}
                  </option>
                  {cuisFiltro.map((cui) => (
                    <option key={cui} value={cui}>
                      {cui}
                    </option>
                  ))}
                </select>
              </div>

              {/* CUE */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">CUE</label>
                <select
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
                  value={selCueFiltro}
                  onChange={(e) =>
                    setSelCueFiltro(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  disabled={!selCuiFiltro || loadingCues}
                >
                  <option value="">
                    {!selCuiFiltro
                      ? "Seleccioná CUI"
                      : loadingCues
                      ? "Cargando..."
                      : "Todos"}
                  </option>
                  {cuesFiltro.map((cue) => (
                    <option key={cue} value={cue}>
                      {cue}
                    </option>
                  ))}
                </select>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-300 disabled:text-gray-600"
                  disabled={!selCuiFiltro}
                  onClick={async () => {
                    if (!selCuiFiltro) return;
                    try {
                      setLoadingResumen(true);
                      setOpenResumen(true);

                      const p = new URLSearchParams();
                      if (localidad) p.set("localidad", localidad);
                      p.set("cui", String(selCuiFiltro));
                      if (selCueFiltro) p.set("cue", String(selCueFiltro));

                      const res = await fetch(
                        `/api/dashboard/resumen-establecimiento?${p.toString()}`,
                        {
                          credentials: "include",
                        }
                      );
                      const data = await res.json();
                      setResumen(data);
                    } catch {
                      setResumen(null);
                    } finally {
                      setLoadingResumen(false);
                    }
                  }}
                >
                  Ver resumen
                </button>

                {(selCuiFiltro || selCueFiltro) && (
                  <button
                    className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setSelCuiFiltro("");
                      setSelCueFiltro("");
                      setCuesFiltro([]);
                    }}
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4 print:gap-6 print:mb-6">
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-5 shadow-sm print:rounded-md print:border print:border-gray-300 print:bg-white print:shadow-none overflow-hidden print-avoid">
            <div className="text-xs uppercase tracking-wide text-indigo-600">
              Predios (CUI)
            </div>
            <div className="mt-2 text-3xl font-semibold text-gray-900 print:text-2xl">
              {resumenRelevado.cuis.toLocaleString("es-AR")}
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

        {/* Gráficos */}
        {loadingData ? (
          <div className="text-gray-500">Cargando datos…</div>
        ) : (
          <div className="space-y-8 print:space-y-6">
            {/* Edificios por nivel */}
            <section className="print:break-inside-avoid-page">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 print:text-base">
                  Edificios por nivel
                </h2>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white px-4 pt-2 pb-4 shadow-sm print:rounded-md print:border print:border-gray-300 print:bg-white print:shadow-none overflow-hidden print-avoid">
                <div className="h-64 print:h-64 w-full max-w-[640px] mx-auto print:max-w-[600px]">
                  <ResponsiveContainer width="99%" height="100%">
                    <BarChart
                      data={mergedByNivel}
                      margin={{ top: 12, right: 18, left: 18, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="nivel"
                        tick={{ fontSize: 11 }}
                        tickMargin={8}
                      />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<TooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
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
            <section className="print:break-inside-avoid-page">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 print:text-base">
                  Aulas por nivel
                </h2>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white px-4 pt-2 pb-4 shadow-sm print:rounded-md print:border print:border-gray-300 print:bg-white print:shadow-none overflow-hidden print-avoid">
                <div className="h-64 print:h-64 w-full max-w-[640px] mx-auto print:max-w-[600px]">
                  <ResponsiveContainer width="99%" height="100%">
                    <BarChart
                      data={mergedByNivel}
                      margin={{ top: 12, right: 18, left: 18, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="nivel"
                        tick={{ fontSize: 11 }}
                        tickMargin={8}
                      />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<TooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
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
            <section className="print:break-inside-avoid-page">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 print:text-base">
                  Metros cuadrados por nivel
                </h2>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white px-4 pt-2 pb-4 shadow-sm print:rounded-md print:border print:border-gray-300 print:bg-white print:shadow-none overflow-hidden print-avoid">
                <div className="h-64 print:h-64 w-full max-w-[640px] mx-auto print:max-w-[600px]">
                  <ResponsiveContainer width="99%" height="100%">
                    <BarChart
                      data={mergedByNivel}
                      margin={{ top: 12, right: 18, left: 18, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="nivel"
                        tick={{ fontSize: 11 }}
                        tickMargin={8}
                      />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<TooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
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
            <section className="print:break-inside-avoid-page">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 print:text-base">
                  Construcciones por nivel de conservación
                </h2>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white px-4 pt-2 pb-4 shadow-sm print:rounded-md print:border print:border-gray-300 print:bg-white print:shadow-none overflow-hidden print-avoid">
                <div className="h-64 print:h-64 w-full max-w-[640px] mx-auto print:max-w-[600px]">
                  <ResponsiveContainer width="99%" height="100%">
                    <BarChart
                      data={conservacionConstruccionesSeries}
                      margin={{ top: 12, right: 18, left: 18, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="grupo"
                        tick={{ fontSize: 11 }}
                        tickMargin={8}
                      />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<TooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
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
            <section className="print:break-inside-avoid-page">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 print:text-base">
                  Edificios por nivel educativo y estado de conservación
                </h2>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white px-4 pt-2 pb-4 shadow-sm print:rounded-md print:border print:border-gray-300 print:bg-white print:shadow-none overflow-hidden print-avoid">
                <div className="h-96 print:h-64 w-full max-w-[640px] mx-auto print:max-w-[600px]">
                  <ResponsiveContainer width="99%" height="100%">
                    <BarChart
                      data={mergedByNivelAndConservacion}
                      margin={{ top: 12, right: 18, left: 18, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />

                      <XAxis
                        dataKey="nivel"
                        tick={{ fontSize: 11 }}
                        tickMargin={10}
                        interval={0}
                      />

                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />

                      <Tooltip
                        content={<TooltipContent />}
                        cursor={{ fill: "rgba(99,102,241,0.12)" }}
                      />

                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />

                      <Bar
                        dataKey="Bueno"
                        name="Bueno"
                        stackId="a"
                        fill={CHART_CONSERV.Bueno}
                        style={{ cursor: "pointer" }}
                        onClick={(barData: any) => {
                          const nivel = barData?.payload?.nivel;
                          if (nivel) fetchDrilldown(String(nivel), "Bueno");
                        }}
                      />

                      <Bar
                        dataKey="Regular"
                        name="Regular"
                        stackId="a"
                        fill={CHART_CONSERV.Regular}
                        style={{ cursor: "pointer" }}
                        onClick={(barData: any) => {
                          const nivel = barData?.payload?.nivel;
                          if (nivel) fetchDrilldown(String(nivel), "Regular");
                        }}
                      />

                      <Bar
                        dataKey="Malo"
                        name="Malo"
                        stackId="a"
                        fill={CHART_CONSERV.Malo}
                        style={{ cursor: "pointer" }}
                        onClick={(barData: any) => {
                          const nivel = barData?.payload?.nivel;
                          if (nivel) fetchDrilldown(String(nivel), "Malo");
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
            {drillNivel && drillEstado && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Establecimientos · {drillNivel} · {drillEstado}
                    </div>
                    <div className="text-xs text-gray-500">
                      {localidad
                        ? `Localidad: ${localidad}`
                        : "Todas las localidades"}
                    </div>
                  </div>

                  <button
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setDrillNivel("");
                      setDrillEstado("");
                      setDrillItems([]);
                    }}
                  >
                    Limpiar
                  </button>
                </div>

                {loadingDrill ? (
                  <div className="mt-3 text-sm text-gray-500">Cargando…</div>
                ) : drillItems.length === 0 ? (
                  <div className="mt-3 text-sm text-gray-500">
                    Sin resultados
                  </div>
                ) : (
                  <div className="mt-3 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Relev.
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            CUI
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            CUEs
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Instituciones
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Construcciones
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Acción
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {drillItems.map((it) => (
                          <tr
                            key={it.relevamiento_id}
                            className="border-t align-top"
                          >
                            <td className="px-3 py-2">{it.relevamiento_id}</td>
                            <td className="px-3 py-2">{it.cui}</td>
                            <td className="px-3 py-2">{it.cues || "—"}</td>
                            <td className="px-3 py-2">
                              {it.instituciones || "—"}
                            </td>
                            <td className="px-3 py-2">
                              {Number(it.construcciones || 0)}
                            </td>
                            <td className="px-3 py-2">
                              <button
                                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
                                onClick={() => {
                                  const relId = Number(it.relevamiento_id);
                                  const constId = Number(it.construccion_id);

                                  if (!Number.isFinite(relId) || relId <= 0)
                                    return;
                                  if (!Number.isFinite(constId) || constId <= 0)
                                    return;

                                  router.push(
                                    `/relevamiento-construcciones/${relId}?construccionId=${constId}`
                                  );
                                }}
                              >
                                Ver
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

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
                              <span className="text-gray-500">
                                Relevamiento ID:
                              </span>{" "}
                              <span className="font-medium">
                                {resumen.info.relevamiento_id}
                              </span>
                            </div>
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

                        {!bloque2PorServicio ||
                        bloque2PorServicio.porConstruccion.length === 0 ? (
                          <div className="text-xs text-gray-500">Sin datos</div>
                        ) : (
                          <div className="space-y-6">
                            {bloque2PorServicio.porConstruccion.map((c) => (
                              <div
                                key={c.construccion_id}
                                className="rounded-xl border border-gray-200 bg-gray-50/60 p-3"
                              >
                                <div className="mb-2 text-xs font-semibold text-gray-700">
                                  Construcción N°{" "}
                                  {c.numero_construccion != null
                                    ? c.numero_construccion
                                    : c.construccion_id}
                                </div>

                                <div className="space-y-3">
                                  {/* Conservación */}
                                  {c.conservacion.length > 0 && (
                                    <TablaServicio
                                      titulo="Conservación de la construcción"
                                      rows={c.conservacion}
                                      mostrarConteo={false} // 👈 por construcción, no mostramos "Construcciones"
                                    />
                                  )}

                                  {/* Servicios de esta construcción */}
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
