import { useLocalObject } from "@/hooks/useLocalSection";
import { Dimension } from "@/interfaces/DimensionLocales";

const DimensionesEditable = ({
  localId,
  relevamientoId,
}: {
  localId: number;
  relevamientoId: number;
}) => {
  const { data, loading, error, isSaving, updateData } =
    useLocalObject<Dimension>(localId, relevamientoId, "dimensiones");

  const handleChange = (field: keyof Dimension, value: number) => {
    if (!data) return;
    updateData({ ...data, [field]: value });
  };

if (loading) {
  return (
    <div className="mx-10 p-4">
      <h2 className="h-5 bg-gray-300 rounded w-40 mb-2 animate-pulse"></h2>
      <p className="h-3 bg-gray-200 rounded w-48 mb-4 animate-pulse"></p>

      <div className="flex justify-center gap-4">
        {["largo", "ancho", "altura max", "altura min"].map((_, i) => (
          <div
            key={i}
            className="w-24 h-10 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
  if (error) return <p className="text-red-500 mx-10 text-center">{error}</p>;

  return (
    <div className="mx-10 text-center p-4 rounded-xl shadow border border-gray-200 mb-4">
      <h2 className="font-semibold">Dimensiones</h2>
      <p className="text-xs text-gray-500 font-semibold mb-2">
        (Los cambios se guardan de manera automática)
      </p>
      <div className="flex justify-center gap-4">
        <label>
          Largo predominante:
          <input
            type="number"
            value={data?.largo_predominante}
            onChange={(e) =>
              handleChange("largo_predominante", Number(e.target.value))
            }
            className="border px-2 py-1 rounded"
          />
        </label>
        <label>
          Ancho predominante:
          <input
            type="number"
            value={data?.ancho_predominante}
            onChange={(e) =>
              handleChange("ancho_predominante", Number(e.target.value))
            }
            className="border px-2 py-1 rounded"
          />
        </label>
        <label>
          Altura máxima:
          <input
            type="number"
            value={data?.altura_maxima}
            onChange={(e) =>
              handleChange("altura_maxima", Number(e.target.value))
            }
            className="border px-2 py-1 rounded"
          />
        </label>
        <label>
          Altura mínima:
          <input
            type="number"
            value={data?.altura_minima}
            onChange={(e) =>
              handleChange("altura_minima", Number(e.target.value))
            }
            className="border px-2 py-1 rounded"
          />
        </label>
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

export default DimensionesEditable;
