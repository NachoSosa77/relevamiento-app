"use client";

import { useLocalArray } from "@/hooks/useLocalArray";
import { tipoMateriales } from "../config/tipoMateriales";

export interface MaterialPredominante {
  id: number;
  item: string;
  material: string;
  estado: string;
  local_id: number;
  relevamiento_id: number;
}

interface MaterialesPredominantesEditableProps {
  localId: number;
  relevamientoId: number;
}

const MaterialesPredominantesEditable = ({
  localId,
  relevamientoId,
}: MaterialesPredominantesEditableProps) => {
  const { data, loading, error, isSaving, updateData } =
    useLocalArray<MaterialPredominante>(
      localId,
      relevamientoId,
      "materialesPredominantes"
    );

  const handleChange = (
    index: number,
    field: keyof MaterialPredominante,
    value: string
  ) => {
    if (!data) return;
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    updateData(newData[index]);
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
            <div className="w-40 h-5 bg-gray-300 rounded"></div> {/* item */}
            <div className="w-48 h-5 bg-gray-200 rounded"></div>{" "}
            {/* material */}
            <div className="w-32 h-5 bg-gray-200 rounded"></div> {/* estado */}
          </div>
        ))}
      </div>
    );
  }
  if (error) return <p className="text-red-500 mx-10 text-center">{error}</p>;

  return (
    <div className="mx-10 text-center p-4 rounded-xl shadow border border-gray-200 mb-4">
      <h2 className="font-semibold mb-2">Materiales Predominantes</h2>
      <p className="text-xs text-gray-500 font-semibold mb-2">
        (Los cambios se guardan de manera automática)
      </p>

      <div className="flex flex-col gap-3">
        {data?.map((mat, i) => {
          const tipo = tipoMateriales.find((t) => t.question === mat.item);
          return (
            <div
              key={mat.id}
              className="flex flex-col md:flex-row items-center justify-center gap-4 border p-3 rounded-lg bg-gray-50"
            >
              <span className="w-40 text-left font-medium">{mat.item}:</span>

              {tipo ? (
                <select
                  value={mat.material}
                  onChange={(e) => handleChange(i, "material", e.target.value)}
                  className="border px-2 py-1 rounded w-48"
                >
                  {tipo.opciones.map((op) => (
                    <option key={op.id} value={op.name}>
                      {op.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={mat.material}
                  onChange={(e) => handleChange(i, "material", e.target.value)}
                  className="border px-2 py-1 rounded w-48"
                />
              )}

              <select
                value={mat.estado}
                onChange={(e) => handleChange(i, "estado", e.target.value)}
                className="border px-2 py-1 rounded w-32"
              >
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Malo">Malo</option>
              </select>
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

export default MaterialesPredominantesEditable;
