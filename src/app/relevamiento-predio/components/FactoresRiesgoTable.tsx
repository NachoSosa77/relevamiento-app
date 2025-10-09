import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import {
  Column,
  FactoresRiesgoAmbiental,
} from "@/interfaces/FactoresRiesgoAmbienta";
import { setFactores } from "@/redux/slices/serviciosFactoresSlice";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface FactoresRiesgoFormProps {
  serviciosData: FactoresRiesgoAmbiental[];
  columnsConfig: Column[];
}

const FactoresRiesgoTable: React.FC<FactoresRiesgoFormProps> = ({
  serviciosData,
  columnsConfig,
}) => {
  const dispatch = useDispatch();
  const relevamientoId = useRelevamientoId();

  const [servicios, setServicios] =
    useState<FactoresRiesgoAmbiental[]>(serviciosData);

  const [loading, setLoading] = useState(true);
  const [dbHasData, setDbHasData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos existentes desde DB
  useEffect(() => {
    if (!relevamientoId) return;

    const fetchFactores = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/servicios_factores_riesgo/${relevamientoId}`
        );

        if (res.status === 404) {
          // No hay datos en DB -> usamos catálogo inicial
          setDbHasData(false);
          setServicios(serviciosData);
          dispatch(setFactores(serviciosData));
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const filas = (data.servicios || []) as FactoresRiesgoAmbiental[];

        if (!filas.length) {
          setDbHasData(false);
          setServicios(serviciosData);
          dispatch(setFactores(serviciosData));
        } else {
          setDbHasData(true);
          setServicios(filas);
          dispatch(setFactores(filas));
        }
      } catch (e) {
        console.error("Error cargando factores:", e);
        setDbHasData(false);
        setServicios(serviciosData);
        dispatch(setFactores(serviciosData));
      } finally {
        setLoading(false);
      }
    };

    fetchFactores();
  }, [relevamientoId, dispatch, serviciosData]);

  const handleChange = (
    index: number,
    field: keyof FactoresRiesgoAmbiental,
    value: string
  ) => {
    const updated = [...servicios];
    updated[index] = { ...updated[index], [field]: value };
    setServicios(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar: al menos un campo (select/input) completo
    const alMenosUnCampoValido = servicios.some((servicio) =>
      columnsConfig.some((column) => {
        if (column.type === "text") return false;
        const v = servicio[column.key];
        return typeof v === "string" && v.trim() !== "";
      })
    );

    if (!alMenosUnCampoValido) {
      toast.warning("Por favor, completá al menos un campo antes de continuar.");
      return;
    }

    const payload = servicios.map((s) => ({
      ...s,
      relevamiento_id: relevamientoId,
    }));

    setIsSubmitting(true);
    try {
      const method = dbHasData ? "PATCH" : "POST";
      const url = dbHasData
        ? `/api/servicios_factores_riesgo/${relevamientoId}`
        : `/api/servicios_factores_riesgo`;

      const body = dbHasData ? { factores: payload } : payload;

      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        console.error("Error al guardar factores:", resp.status);
        toast.error("No se pudieron guardar los factores de riesgo.");
        return;
      }

      toast.success(
        dbHasData
          ? "Factores actualizados correctamente!"
          : "Factores cargados correctamente!"
      );

      // 🔁 Refrescar desde DB para activar banner y mostrar lo persistido
      const refresh = await fetch(
        `/api/servicios_factores_riesgo/${relevamientoId}`
      );
      if (refresh.ok) {
        const data = await refresh.json();
        const filas = (data.servicios || []) as FactoresRiesgoAmbiental[];
        setServicios(filas.length ? filas : serviciosData);
        dispatch(setFactores(filas.length ? filas : serviciosData));
        setDbHasData(!!filas.length);
      } else if (refresh.status === 404) {
        setDbHasData(false);
      } else {
        toast.warning(
          "Datos guardados, pero no se pudo refrescar el formulario."
        );
      }
    } catch (e) {
      console.error(e);
      toast.error("Error inesperado al enviar los datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    // si querés un skeleton, podés replicar el de transporte
    return (
      <div className="p-2 mx-10 mt-4 bg-white rounded-lg border shadow-lg animate-pulse">
        <div className="h-6 w-64 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 mx-10 mt-4 bg-white rounded-lg border shadow-lg"
    >
      {dbHasData && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded">
          Estás editando un registro ya existente.
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-custom text-white text-center">
            {columnsConfig.map((column) => (
              <th
                key={column.key}
                className={`border p-2 text-center ${
                  column.key === "id_servicio" ? "bg-custom/50 text-white" : ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio, index) => (
            <tr key={servicio.id_servicio}>
              {columnsConfig.map((column) => (
                <td
                  key={`${servicio.id_servicio}-${column.key}`}
                  className="border p-2 text-center"
                >
                  {column.type === "select" && (
                    <select
                      value={(servicio as any)[column.key] || ""}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        handleChange(index, column.key, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={
                        column.conditional && !column.conditional(servicio)
                      }
                    >
                      <option value="">Seleccionar</option>
                      {column.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {column.type === "input" && (
                    <input
                      type="text"
                      value={(servicio as any)[column.key] || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, column.key, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={
                        column.conditional && !column.conditional(servicio)
                      }
                    />
                  )}

                  {column.type === "text" && (
                    <div>{(servicio as any)[column.key]}</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="text-sm font-bold bg-custom hover:bg-custom/50 text-white p-2 rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Guardando..."
            : dbHasData
            ? "Actualizar información"
            : "Guardar información"}
        </button>
      </div>
    </form>
  );
};

export default FactoresRiesgoTable;
