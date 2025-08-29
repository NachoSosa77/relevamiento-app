"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useLocalArray } from "@/hooks/useLocalArray";
import { useEffect, useState } from "react";
import { tipoAberturas } from "../config/tipoMateriales";

export interface Abertura {
  id: number;
  abertura: string;
  tipo: string;
  cantidad: number | null;
  estado: string | null;
  local_id: number;
  relevamiento_id: number;
}

interface AberturasEditableProps {
  localId: number;
  relevamientoId: number;
}

const AberturasEditable = ({
  localId,
  relevamientoId,
}: AberturasEditableProps) => {
  const { data, loading, error, isSaving, updateData } =
    useLocalArray<Abertura>(localId, relevamientoId, "aberturas");

  const [responses, setResponses] = useState<
    Record<string, Record<string, Abertura>>
  >({});

  // Inicializa responses a partir de data
  useEffect(() => {
    if (data && data.length > 0) {
      const initial: Record<string, Record<string, Abertura>> = {};
      data.forEach((item) => {
        if (!initial[item.abertura]) initial[item.abertura] = {};
        initial[item.abertura][item.tipo] = item;
      });
      setResponses(initial);
    }
  }, [data]);

  const handleCantidadChange = (
    abertura: string,
    tipo: string,
    value: number | undefined
  ) => {
    const current = responses[abertura]?.[tipo];
    if (!current) return;
    const updated = { ...current, cantidad: value ?? null };
    setResponses((prev) => ({
      ...prev,
      [abertura]: { ...prev[abertura], [tipo]: updated },
    }));
    updateData(updated);
  };

  const handleEstadoChange = (
    abertura: string,
    tipo: string,
    value: string
  ) => {
    const current = responses[abertura]?.[tipo];
    if (!current) return;
    const updated = { ...current, estado: value };
    setResponses((prev) => ({
      ...prev,
      [abertura]: { ...prev[abertura], [tipo]: updated },
    }));
    updateData(updated);
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
          <div className="w-36 h-5 bg-gray-300 rounded"></div>
          <div className="w-36 h-5 bg-gray-200 rounded"></div>
          <div className="w-20 h-5 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="w-10 h-5 bg-gray-200 rounded"></div>
            <div className="w-10 h-5 bg-gray-200 rounded"></div>
            <div className="w-10 h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
  if (error) return <p className="text-red-500 mx-10 text-center">{error}</p>;

  return (
    <div className="mx-10 text-center p-4 rounded-xl shadow border border-gray-200 mb-4">
      <h2 className="font-semibold mb-2">Aberturas</h2>
      <p className="text-xs text-gray-500 font-semibold mb-2">
        (Los cambios se guardan de manera automática)
      </p>

      <div className="flex flex-col gap-4">
        {tipoAberturas.map(({ id, question, showCondition, opciones }) => {
          return opciones.length > 0 ? (
            opciones.map((tipo) => {
              const current = responses[question]?.[tipo];
              return (
                <div
                  key={`${id}-${tipo}`}
                  className="flex flex-col md:flex-row items-center justify-center gap-4 border p-3 rounded-lg bg-gray-50"
                >
                  <span className="w-36 font-medium text-left">{question}:</span>
                  <span className="w-36 text-center">{tipo}</span>

                  <NumericInput
                    value={current?.cantidad ?? undefined}
                    onChange={(val) => handleCantidadChange(question, tipo, val)}
                    label=""
                    subLabel=""
                    disabled={!showCondition}
                  />

                  <div className="flex gap-2">
                    {["Bueno", "Regular", "Malo"].map((estado) => (
                      <label key={estado} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`estado-${id}-${tipo}`}
                          value={estado}
                          checked={current?.estado === estado}
                          onChange={() =>
                            handleEstadoChange(question, tipo, estado)
                          }
                        />
                        {estado}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div
              key={id}
              className="flex flex-col md:flex-row justify-center items-center gap-4 border p-3 rounded-lg bg-gray-50"
            >
              <span className="w-36 font-medium text-left">{question}:</span>
              <span className="w-36 text-center text-slate-400 bg-slate-200 rounded py-1">
                No corresponde
              </span>

              <NumericInput
                value={responses[question]?.["default"]?.cantidad ?? undefined}
                onChange={(val) => handleCantidadChange(question, "default", val)}
                label=""
                subLabel=""
                disabled
              />

              <div className="flex gap-2">
                {["Bueno", "Regular", "Malo"].map((estado) => (
                  <label key={estado} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`estado-${id}-default`}
                      value={estado}
                      checked={responses[question]?.["default"]?.estado === estado}
                      onChange={() =>
                        handleEstadoChange(question, "default", estado)
                      }
                      disabled
                    />
                    {estado}
                  </label>
                ))}
              </div>
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

export default AberturasEditable;
