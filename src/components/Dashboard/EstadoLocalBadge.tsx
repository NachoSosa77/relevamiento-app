// src/components/dashboard/EstadoLocalBadge.tsx
"use client";

import { useEffect, useState } from "react";

type Clasificacion = "Bueno" | "Regular" | "Malo";

type EstadoLocalApiResponse = {
  local_id: number;
  relevamiento_id: number;
  estado_local: {
    score: number;
    clasificacion: Clasificacion;
    clasificacionScore?: Clasificacion;
    tieneCriticoMalo: boolean;
    criticosMalo?: string[];
  };
};

interface Props {
  localId: number;
  relevamientoId: number;
}

const colorByClasificacion: Record<Clasificacion, string> = {
  Bueno: "bg-green-100 text-green-800 border-green-300",
  Regular: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Malo: "bg-red-100 text-red-800 border-red-300",
};

export function EstadoLocalBadge({ localId, relevamientoId }: Props) {
  const [data, setData] = useState<EstadoLocalApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchEstado() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/materiales_predominantes/estado?localId=${localId}&relevamientoId=${relevamientoId}`
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }

        const json: EstadoLocalApiResponse = await res.json();
        if (!cancelled) {
          setData(json);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Error cargando estado local");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchEstado();

    return () => {
      cancelled = true;
    };
  }, [localId, relevamientoId]);

  if (loading) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full border bg-gray-50 text-gray-500">
        Cargando...
      </span>
    );
  }

  if (error || !data?.estado_local) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full border bg-gray-100 text-gray-500">
        Sin datos
      </span>
    );
  }

  const { clasificacion, score, tieneCriticoMalo, criticosMalo } =
    data.estado_local;

  const colorClass = colorByClasificacion[clasificacion];

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${colorClass}`}
      >
        {clasificacion}{" "}
        <span className="ml-1 text-[10px] opacity-70">
          ({score.toFixed(1)})
        </span>
      </span>

      {tieneCriticoMalo && criticosMalo && criticosMalo.length > 0 && (
        <span className="text-[10px] text-red-600">
          Crítico en: {criticosMalo.join(", ")}
        </span>
      )}
    </div>
  );
}
