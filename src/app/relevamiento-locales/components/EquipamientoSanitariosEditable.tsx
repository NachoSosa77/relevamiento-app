"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useLocalArray } from "@/hooks/useLocalArray";
import { useEffect, useState } from "react";
import { equipamientoSanitario } from "../config/equipamientoCocina";

export interface EquipamientoSanitario {
  id: number;
  equipamiento: string;
  cantidad: number | null;
  cantidad_funcionamiento: number | null;
  estado: string | null;
  local_id: number;
  relevamiento_id: number;
}

interface Props {
  localId: number;
  relevamientoId: number;
}

export default function EquipamientoSanitarioEditable({
  localId,
  relevamientoId,
}: Props) {
  const { data, loading, error, isSaving, updateData } =
    useLocalArray<EquipamientoSanitario>(
      localId,
      relevamientoId,
      "equipamientoSanitarios"
    );

  const [responses, setResponses] = useState<
    Record<string, EquipamientoSanitario>
  >({});
  const [otroInput] = useState("");

  useEffect(() => {
    if (data && data.length > 0) {
      const initial: Record<string, EquipamientoSanitario> = {};
      data.forEach((item) => {
        initial[item.equipamiento] = item;
      });
      setResponses(initial);
    }
  }, [data]);

  const handleChange = (
    question: string,
    field: keyof EquipamientoSanitario,
    value: number | string | null
  ) => {
    const equipamientoName =
      question === "Otro" ? otroInput.trim() || "Otro" : question;
    const current = responses[equipamientoName];
    const updated: EquipamientoSanitario = {
      ...current,
      equipamiento: equipamientoName,
      local_id: localId,
      relevamiento_id: relevamientoId,
      [field]: value,
    };
    setResponses((prev) => ({ ...prev, [equipamientoName]: updated }));
    updateData(updated);
  };

  if (loading) {
    return (
      <div className="mx-10 p-4">
        <h2 className="h-5 bg-gray-300 rounded w-64 mb-2 animate-pulse"></h2>
        <p className="h-3 bg-gray-200 rounded w-48 mb-4 animate-pulse"></p>

        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center justify-between gap-4 border p-3 rounded-lg bg-gray-50"
            >
              <div className="w-36 h-5 bg-gray-300 rounded"></div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
              <div className="w-40 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-500 mx-10 text-center">{error}</p>;

  return (
    <div className="mx-10 text-center p-4 rounded-xl shadow border border-gray-200 mb-4">
      <h2 className="font-semibold mb-2">Equipamiento Sanitario</h2>
      <p className="text-xs text-gray-500 font-semibold mb-2">
        (Los cambios se guardan de manera automática)
      </p>

      <div className="flex flex-col gap-4">
        {equipamientoSanitario.map(({ id, question, showCondition }) => {
          const equipamientoName =
            question === "Otro" ? otroInput.trim() || "Otro" : question;
          const current = responses[equipamientoName];

          return (
            <div
              key={id}
              className="flex flex-col md:flex-row items-center justify-center gap-4 border p-3 rounded-lg bg-gray-50"
            >
              <span className="w-36 font-medium text-left">{question}:</span>

              {/* Cantidad */}
              <NumericInput
                value={current?.cantidad ?? undefined}
                onChange={(val) =>
                  handleChange(question, "cantidad", val ?? null)
                }
                label=""
                subLabel=""
                disabled={false}
              />

              {/* Cantidad en funcionamiento */}
              <NumericInput
                value={current?.cantidad_funcionamiento ?? undefined}
                onChange={(val) =>
                  handleChange(question, "cantidad_funcionamiento", val ?? null)
                }
                label=""
                subLabel=""
                disabled={false}
              />

              {/* Estado */}
              {showCondition ? (
                <div className="flex gap-2">
                  {["Bueno", "Regular", "Malo"].map((estado) => (
                    <label key={estado} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`estado-${id}`}
                        value={estado}
                        checked={current?.estado === estado}
                        onChange={() =>
                          handleChange(question, "estado", estado)
                        }
                      />
                      {estado}
                    </label>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400">No corresponde</span>
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
            <circle cx="12" cy="12" r="10" stroke="currentColor" />
          </svg>
          <span className="font-semibold text-lg">Guardando...</span>
        </div>
      )}
    </div>
  );
}
