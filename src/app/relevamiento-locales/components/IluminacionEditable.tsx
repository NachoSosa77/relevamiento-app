"use client";

import DecimalNumericInput from "@/components/ui/DecimalNumericInput";
import { useLocalArray } from "@/hooks/useLocalArray";
import { useEffect, useState } from "react";
import { tipo_ilumincacion } from "../config/tipoIlumincaion";

export interface Iluminacion {
  id: number;
  condicion: string;
  tipo: string;
  disponibilidad: string | null; // "Si" | "No"
  superficie_iluminacion: number | null;
  superficie_ventilacion: number | null;
  local_id: number;
  relevamiento_id: number;
}

interface IluminacionEditableProps {
  localId: number;
  relevamientoId: number;
}

const IluminacionEditable = ({
  localId,
  relevamientoId,
}: IluminacionEditableProps) => {
  const { data, loading, error, isSaving, updateData } =
    useLocalArray<Iluminacion>(localId, relevamientoId, "iluminacion");

  const [responses, setResponses] = useState<Record<string, Iluminacion>>({});
  const [localTemp, setLocalTemp] = useState<
    Record<string, number | undefined>
  >({});

  useEffect(() => {
    if (data) {
      const initial: Record<string, Iluminacion> = {};
      data.forEach((item) => {
        initial[item.condicion] = item;
      });
      setResponses(initial);
    }
  }, [data]);

  const handleChange = (
    condicion: string,
    field: keyof Iluminacion,
    value: string | number | null
  ) => {
    const current = responses[condicion];
    if (!current) {
      console.warn("current undefined para", condicion);
      return;
    }
    const updated = { ...current, [field]: value };
    setResponses((prev) => ({ ...prev, [condicion]: updated }));
    updateData({ ...updated, id: current.id });
  };

  if (loading) {
  return (
    <div className="mx-10 p-4">
      <h2 className="h-5 bg-gray-300 rounded w-64 mb-2 animate-pulse"></h2>
      <p className="h-3 bg-gray-200 rounded w-48 mb-4 animate-pulse"></p>

      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row items-center justify-between gap-4 border p-3 rounded-lg bg-gray-50 animate-pulse mb-2"
        >
          <div className="w-60 h-5 bg-gray-300 rounded"></div>
          <div className="w-32 h-5 bg-gray-200 rounded"></div>
          <div className="w-32 h-5 bg-gray-200 rounded"></div>
          <div className="w-24 h-5 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
  if (error) return <p className="text-red-500 mx-10 text-center">{error}</p>;

  return (
    <div className="mx-10 text-center p-4 rounded-xl shadow border border-gray-200 mb-4">
      <h2 className="font-semibold mb-2">Iluminación y Ventilación</h2>
      <p className="text-xs text-gray-500 font-semibold mb-2">
        (Los cambios se guardan de manera automática)
      </p>

      <div className="flex flex-col gap-4">
        {tipo_ilumincacion.map(({ id, question, showCondition, opciones }) => {
          const current = responses[question];

          return (
            <div
              key={id}
              className="flex flex-col md:flex-row items-center justify-center gap-4 border p-3 rounded-lg bg-gray-50"
            >
              <span className="w-60 font-medium text-left">{question}:</span>

              {/* Disponibilidad si no tiene opciones */}
              {opciones.length === 0 && showCondition && (
                <div className="flex gap-4">
                  {["Si", "No"].map((val) => (
                    <label key={val} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`disp-${id}`}
                        value={val}
                        checked={current?.disponibilidad === val}
                        onChange={() =>
                          handleChange(question, "disponibilidad", val)
                        }
                      />
                      {val}
                    </label>
                  ))}
                </div>
              )}

              {/* Superficies */}
              {/* Superficies */}
              {opciones.length > 0 && current && (
                <div className="flex gap-4 items-center">
                  <DecimalNumericInput
                    value={
                      localTemp[`${current.id}-iluminacion`] ??
                      current.superficie_iluminacion ??
                      undefined
                    }
                    onChange={(val) =>
                      setLocalTemp((prev) => ({
                        ...prev,
                        [`${current.id}-iluminacion`]:
                          val !== undefined ? Number(val) : undefined,
                      }))
                    }
                    label="Iluminación (m²)"
                  />
                  <DecimalNumericInput
                    value={
                      localTemp[`${current.id}-ventilacion`] ??
                      current.superficie_ventilacion ??
                      undefined
                    }
                    onChange={(val) =>
                      setLocalTemp((prev) => ({
                        ...prev,
                        [`${current.id}-ventilacion`]:
                          val !== undefined ? Number(val) : undefined,
                      }))
                    }
                    label="Ventilación (m²)"
                  />
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      if (!current.id)
                        return console.error("No hay id para actualizar");

                      const updated = {
                        id: current.id,
                        superficie_iluminacion:
                          localTemp[`${current.id}-iluminacion`] ??
                          current.superficie_iluminacion ??
                          null,
                        superficie_ventilacion:
                          localTemp[`${current.id}-ventilacion`] ??
                          current.superficie_ventilacion ??
                          null,
                      };


                      updateData(updated);

                      // Limpiar temporal para que se muestre lo que viene de la base
                      setLocalTemp((prev) => ({
                        ...prev,
                        [`${current.id}-iluminacion`]: undefined,
                        [`${current.id}-ventilacion`]: undefined,
                      }));
                    }}
                  >
                    Guardar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isSaving && (
        <div className="flex items-center justify-center gap-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg p-3 mt-4 shadow-md animate-pulse">
          <svg
            className="w-6 h-6 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <span className="font-semibold text-lg">Guardando...</span>
        </div>
      )}
    </div>
  );
};

export default IluminacionEditable;
