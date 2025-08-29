"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useLocalArray } from "@/hooks/useLocalArray";
import { useEffect, useState } from "react";

export interface AcondicionamientoTermico {
  id: number;
  temperatura: string;
  tipo: string;
  cantidad: number | null;
  disponibilidad: string | null; // "Si" | "No"
  local_id: number;
  relevamiento_id: number;
}

interface AcondicionamientoTermicoEditableProps {
  localId: number;
  relevamientoId: number;
}

const tiposConDisponibilidad = [
  "Aire acondicionado central",
  "Calefacción central",
];

const AcondicionamientoTermicoEditable = ({
  localId,
  relevamientoId,
}: AcondicionamientoTermicoEditableProps) => {
  const { data, loading, error, isSaving, updateData } =
    useLocalArray<AcondicionamientoTermico>(
      localId,
      relevamientoId,
      "acondicionamientoTermico"
    );

  const [responses, setResponses] = useState<
    Record<number, AcondicionamientoTermico>
  >({});

  useEffect(() => {
    if (data) {
      const initial: Record<number, AcondicionamientoTermico> = {};
      data.forEach((item) => {
        initial[item.id] = item;
      });
      setResponses(initial);
    }
  }, [data]);

  const handleChange = (
  id: number,
  field: keyof AcondicionamientoTermico,
  value: string | number | null
) => {
  const current = responses[id];
  if (!current) return;
  const updated = { ...current, [field]: value };
  setResponses((prev) => ({ ...prev, [id]: updated }));
  updateData(updated); // guardar automático
};

  if (loading) {
  return (
    <div className="mx-10 p-4">
      <h2 className="h-5 bg-gray-300 rounded w-64 mb-2 animate-pulse"></h2>
      <p className="h-3 bg-gray-200 rounded w-48 mb-4 animate-pulse"></p>

      {/* Skeleton para cada temperatura (ej: Frío / Calor) */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="mb-6">
          <h3 className="h-4 bg-gray-300 rounded w-32 mb-2 animate-pulse"></h3>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="flex flex-col md:flex-row items-center justify-between gap-4 border p-3 rounded-lg bg-gray-50 animate-pulse"
              >
                <div className="w-60 h-5 bg-gray-300 rounded"></div>
                <div className="w-32 h-5 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
  if (error) return <p className="text-red-500 mx-10 text-center">{error}</p>;

  // agrupamos por temperatura (Frío/Calor)
  const agrupado = data?.reduce<Record<string, AcondicionamientoTermico[]>>(
    (acc, item) => {
      if (!acc[item.temperatura]) acc[item.temperatura] = [];
      acc[item.temperatura].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="mx-10 text-center p-4 rounded-xl shadow border border-gray-200 mb-4">
      <h2 className="font-semibold mb-2">Acondicionamiento térmico</h2>
      <p className="text-xs text-gray-500 font-semibold mb-4">
        (Los cambios se guardan de manera automática)
      </p>

      {agrupado &&
        Object.entries(agrupado).map(([temp, items]) => (
          <div key={temp} className="mb-6">
            <h3 className="text-left font-bold text-custom mb-2">
              {temp.toUpperCase()}
            </h3>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center justify-between gap-4 border p-3 rounded-lg bg-gray-50"
                >
                  <span className="w-60 text-left">{item.tipo}</span>

                  {tiposConDisponibilidad.includes(item.tipo) ? (
                    <div className="flex gap-4">
                      {["Si", "No"].map((val) => (
                        <label key={val} className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`disp-${item.id}`}
                            value={val}
                            checked={responses[item.id]?.disponibilidad === val}
                            onChange={() =>
                              handleChange(item.id, "disponibilidad", val)
                            }
                          />
                          {val}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <NumericInput
                      value={responses[item.id]?.cantidad ?? 0}
                      onChange={(val) =>
                        handleChange(
                          item.id,
                          "cantidad",
                          val !== undefined ? Number(val) : null
                        )
                      }
                      label=""
                      subLabel=""
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

      {isSaving && (
        <div className="flex items-center justify-center gap-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg p-3 mt-4 shadow-md animate-pulse">
          <svg
            className="w-6 h-6 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="font-semibold text-lg">Guardando...</span>
        </div>
      )}
    </div>
  );
};

export default AcondicionamientoTermicoEditable;
