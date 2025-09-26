import ServiciosSkeleton from "@/components/Skeleton/Serviciotableskeleton";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { Column, ServiciosBasicos } from "@/interfaces/ServiciosBasicos";
import { useAppDispatch } from "@/redux/hooks";
import { setServicios } from "@/redux/slices/serviciosSlice";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ServiciosBasicosFormProps {
  serviciosData: ServiciosBasicos[];
  columnsConfig: Column[];
}

const ServiciosBasicosForm: React.FC<ServiciosBasicosFormProps> = ({
  serviciosData,
  columnsConfig,
}) => {
  const dispatch = useAppDispatch();
  const relevamientoId = useRelevamientoId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);

  const [servicios, setServiciosLocal] =
    useState<ServiciosBasicos[]>(serviciosData);

  // Cargar datos existentes desde la DB
  useEffect(() => {
    // Si cargas desde la DB
    const fetchServicios = async () => {
      if (!relevamientoId) return;
      try {
        const res = await fetch(
          `/api/servicios_basicos_predio/${relevamientoId}`
        );
        const data = await res.json();

        const serviciosNormalizados = (data.serviciosBasicos || []).map(
          (s: ServiciosBasicos) => ({
            ...s,
            disponibilidad: s.disponibilidad ?? "",
            distancia: s.distancia ?? "",
            prestadores: s.prestadores ?? "",
            en_predio: s.en_predio?.trim() || "", // <- importante
          })
        );

        setServiciosLocal(serviciosNormalizados);
        dispatch(setServicios(serviciosNormalizados));
        setEditando(serviciosNormalizados.length > 0);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      } finally {
        setLoading(false); // <- importante
      }
    };

    fetchServicios();
  }, [relevamientoId, dispatch]);

  const handleChange = (
    index: number,
    field: keyof ServiciosBasicos,
    value: string
  ) => {
    const updatedServicios = [...servicios];
    updatedServicios[index] = { ...updatedServicios[index], [field]: value };
    setServiciosLocal(updatedServicios);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar al menos un campo modificable completo
    const alMenosUnServicioValido = servicios.some((servicio) =>
      columnsConfig.some((column) => {
        if (column.type === "text") return false;
        const valor = servicio[column.key];
        return valor !== undefined && valor !== null && valor !== "";
      })
    );

    if (!alMenosUnServicioValido) {
      toast.warning("Por favor, completá al menos un campo antes de enviar.");
      return;
    }

    // Evitar duplicados exactos
    const serviciosUnicos = servicios.filter(
      (s, i, self) =>
        i ===
        self.findIndex((t) =>
          columnsConfig.every((col) => s[col.key] === t[col.key])
        )
    );

    const serviciosConRelevamiento = serviciosUnicos.map((s) => ({
      ...s,
      relevamiento_id: relevamientoId,
    }));

    setIsSubmitting(true);
    try {
      const response = await fetch(
        editando
          ? `/api/servicios_basicos_predio/${relevamientoId}` // PATCH
          : "/api/servicios_basicos_predio", // POST
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviciosBasicos: serviciosConRelevamiento }),
        }
      );

      if (response.ok) {
        toast.success(
          editando
            ? "Servicios actualizados correctamente!"
            : "Servicios cargados correctamente!"
        );

        // Refrescar datos desde DB para mantener consistencia
        const refreshRes = await fetch(
          `/api/servicios_basicos_predio/${relevamientoId}`
        );

        if (refreshRes.ok) {
          const data = await refreshRes.json();

          // Normalizar siempre a array y limpiar null/undefined
          const refreshedServicios = (data.serviciosBasicos || []).map(
            (s: ServiciosBasicos) => ({
              ...s,
              disponibilidad: s.disponibilidad ?? "",
              distancia: s.distancia ?? "",
              prestadores: s.prestadores ?? "",
              en_predio: s.en_predio?.trim() || "",
            })
          );

          setServiciosLocal(refreshedServicios);
          dispatch(setServicios(refreshedServicios));
          setEditando(refreshedServicios.length > 0);
        }
      } else {
        toast.error("Error al cargar los servicios.");
      }
    } catch (error) {
      toast.error("Error inesperado al enviar los datos.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <ServiciosSkeleton columnsConfig={columnsConfig} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 mx-10 mt-4 bg-white rounded-lg border shadow-lg"
    >
      {editando && (
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
                  column.key === "id" ? "bg-custom/50 text-white" : ""
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
                      value={servicio[column.key] || ""}
                      onChange={(e) =>
                        handleChange(index, column.key, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={
                        column.conditional && !column.conditional(servicio)
                      }
                    >
                      <option value="">Seleccionar</option>
                      {Array.isArray(column.options)
                        ? column.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))
                        : column.options?.(servicio).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                    </select>
                  )}
                  {column.type === "input" && (
                    <input
                      type="text"
                      value={servicio[column.key] as string}
                      onChange={(e) =>
                        handleChange(index, column.key, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={
                        column.conditional && !column.conditional(servicio)
                      }
                    />
                  )}
                  {column.type === "text" && (
                    <div>{servicio[column.key] as string}</div>
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
            : editando
            ? "Actualizar información"
            : "Guardar información"}
        </button>
      </div>
    </form>
  );
};

export default ServiciosBasicosForm;
