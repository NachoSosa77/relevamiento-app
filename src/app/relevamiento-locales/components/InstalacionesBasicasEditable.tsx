import { useLocalArray } from "@/hooks/useLocalArray";
import { useState } from "react";
import { tipoServiciosBasicos } from "../config/tipoServiciosBasicos";

export interface InstalacionBasica {
  id: number;
  servicio: string;
  tipo_instalacion: string;
  motivo: string;
  funciona: string;
  otroMotivo: string;
  local_id: number;
  relevamiento_id: number;
}

const InstalacionesBasicasEditable = ({
  localId,
  relevamientoId,
}: {
  localId: number;
  relevamientoId: number;
}) => {
  const { data, loading, error, isSaving, updateData } =
    useLocalArray<InstalacionBasica>(
      localId,
      relevamientoId,
      "instalacionesBasicas"
    );

  // Estado local para motivos "Otro"
  const [localOtroMotivo, setLocalOtroMotivo] = useState<{
    [id: number]: string;
  }>({});

  const handleChange = (
  index: number,
  field: keyof InstalacionBasica,
  value: string
) => {
  console.log("handleChange:", index, field, value);

  if (!data) return;
  const newData = [...data];
  const current = { ...newData[index], [field]: value };

  if (field === "funciona" && value === "Si") {
    current.motivo = "";
    current.otroMotivo = "";
  }

  if (field === "motivo") {
    if (value !== "Otro") {
      current.otroMotivo = "";
      updateData({ ...current, motivo: value });
    } else {
      setLocalOtroMotivo((prev) => ({
        ...prev,
        [current.id]:
          current.motivo && current.motivo !== "Otro" ? current.motivo : "",
      }));
      current.motivo = "Otro";
      updateData(current);
    }
  } else {
    // 🔹 Esto asegura que cambios en "funciona" o "tipo_instalacion" se guarden
    updateData(current);
  }

  newData[index] = current;
};

  const handleSaveOtroMotivo = (servicio: InstalacionBasica) => {
    const text = localOtroMotivo[servicio.id]?.trim() || "";
    if (!text) return;
    updateData({ ...servicio, motivo: text });
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
            className="flex flex-col md:flex-row items-center justify-between gap-4 border p-2 rounded bg-gray-50 animate-pulse"
          >
            <div className="w-44 h-5 bg-gray-300 rounded"></div>
            <div className="w-48 h-8 bg-gray-200 rounded"></div>
            <div className="w-32 h-8 bg-gray-200 rounded"></div>
            <div className="w-48 h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
  if (error) return <p className="text-red-500 mx-10 text-center">{error}</p>;

  return (
    <div className="mx-10 text-center p-4 rounded-xl shadow border border-gray-200 mb-4">
      <h2 className="font-semibold mb-2">Instalaciones Básicas</h2>
    <p className="text-xs text-gray-500 font-semibold mb-2">
  (Los cambios se guardan de manera automática, excepto cuando se
  especifica &quot;Otro&quot; motivo)
</p>

      <div className="flex flex-col gap-4">
        {data?.map((servicio, i) => {
          const tipo = tipoServiciosBasicos.find(
            (t) => t.question === servicio.servicio
          );

          const showMotivo =
            servicio.funciona === "No" && tipo?.motivos?.length;

          // ✅ Motivo es válido si existe en la lista de motivos Y no es "Otro"
          const motivoEsValido = tipo?.motivos?.some(
            (m) =>
              m.name.toLowerCase().trim() ===
                servicio.motivo?.toLowerCase().trim() && m.name !== "Otro"
          );

          const mostrarInputOtro =
            servicio.motivo === "Otro" ||
            (!motivoEsValido && servicio.motivo !== "");

          return (
            <div
              key={servicio.id}
              className="flex flex-col md:flex-row justify-center gap-4 items-center border p-2 rounded bg-gray-50"
            >
              <span className="w-44 text-left font-medium">
                {servicio.servicio}:
              </span>

              {tipo && tipo.opciones.length > 0 ? (
                <select
                  value={servicio.tipo_instalacion || ""}
                  onChange={(e) =>
                    handleChange(i, "tipo_instalacion", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-48"
                >
                  <option value="">Seleccionar...</option>
                  {tipo.opciones.map((op) => (
                    <option key={op.id} value={op.name}>
                      {op.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={servicio.tipo_instalacion || ""}
                  onChange={(e) =>
                    handleChange(i, "tipo_instalacion", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-48"
                />
              )}

              {tipo?.showCondition && (
                <div className="flex gap-2 items-center">
                  <label>
                    <input
                      type="radio"
                      name={`funciona-${servicio.id}`}
                      value="Si"
                      checked={servicio.funciona === "Si"}
                      onChange={() => handleChange(i, "funciona", "Si")}
                      className="mr-1"
                    />
                    Sí
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`funciona-${servicio.id}`}
                      value="No"
                      checked={servicio.funciona === "No"}
                      onChange={() => handleChange(i, "funciona", "No")}
                      className="mr-1"
                    />
                    No
                  </label>
                </div>
              )}

              {showMotivo && (
                <div className="flex flex-col gap-1">
                  <select
                    value={
                      motivoEsValido
                        ? servicio.motivo // si es válido de la lista, se muestra
                        : mostrarInputOtro
                        ? "Otro" // si no es válido, usamos "Otro"
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log(
                        "Cambio de select:",
                        value,
                        "servicio.id:",
                        servicio.id
                      );

                      if (value === "Otro") {
                        setLocalOtroMotivo((prev) => ({
                          ...prev,
                          [servicio.id]:
                            !motivoEsValido && servicio.motivo
                              ? servicio.motivo
                              : "",
                        }));
                        handleChange(i, "motivo", "Otro");
                      } else {
                        handleChange(i, "motivo", value);
                      }
                    }}
                    className="border px-2 py-1 rounded w-48"
                  >
                    <option value="">Seleccionar motivo...</option>
                    {tipo.motivos?.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>

                  {/* Input para 'Otro' */}
                  {mostrarInputOtro && (
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="text"
                        placeholder="Especificar otro motivo"
                        value={
                          // Prioridad: lo que el usuario está escribiendo.
                          localOtroMotivo[servicio.id] ??
                          // Si aún no existe en el estado local y vino de BD un motivo no listado, precargarlo.
                          (!motivoEsValido && servicio.motivo
                            ? servicio.motivo
                            : "")
                        }
                        onChange={(e) =>
                          setLocalOtroMotivo((prev) => ({
                            ...prev,
                            [servicio.id]: e.target.value,
                          }))
                        }
                        className="border px-2 py-1 rounded w-48"
                      />
                      <button
                        onClick={() => handleSaveOtroMotivo(servicio)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Guardar
                      </button>
                    </div>
                  )}
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

export default InstalacionesBasicasEditable;
