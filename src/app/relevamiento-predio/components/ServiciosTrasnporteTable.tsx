import ServiciosTransporteSkeleton from "@/components/Skeleton/ServiciosTransporteSkeleton";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import {
  Column,
  ServiciosTransporteComunicaciones,
} from "@/interfaces/ServiciosTransporteComunicaciones";
import { setServicios } from "@/redux/slices/serviciosTransporteSlice";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface ServiciosTransporteFormProps {
  serviciosData: ServiciosTransporteComunicaciones[];
  columnsConfig: Column[];
}

const ServiciosTransporteForm: React.FC<ServiciosTransporteFormProps> = ({
  serviciosData,
  columnsConfig,
}) => {
  const dispatch = useDispatch();
  const relevamientoId = useRelevamientoId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [servicios, setServiciosLocal] =
    useState<ServiciosTransporteComunicaciones[]>(serviciosData);
  // arriba del componente
const normalizeYesNo = (v?: string | null) => {
  if (v === null || v === undefined) return "";
  const t = String(v).trim().toLowerCase();
  if (t === "sí" || t === "si" || t === "s") return "Si";
  if (t === "no" || t === "n") return "No";
  return String(v).trim();
};



  // Cargar datos existentes desde DB
  useEffect(() => {
    const fetchServicios = async () => {
      if (!relevamientoId) return;
      try {
        const res = await fetch(
          `/api/servicios_transporte_comunicaciones/${relevamientoId}`
        );
        const data = await res.json();

        const serviciosNormalizados = (data.servicios || []).map(
  (s: ServiciosTransporteComunicaciones) => ({
    ...s,
    disponibilidad: normalizeYesNo(s.disponibilidad),
    en_predio: s.en_predio ? String(s.en_predio).trim() : "",
    distancia: s.distancia ?? "",
  })
);


        setServiciosLocal(serviciosNormalizados);
        dispatch(setServicios(serviciosNormalizados));
        setEditando(serviciosNormalizados.length > 0);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, [relevamientoId, dispatch]);

  const handleChange = (
  index: number,
  field: keyof ServiciosTransporteComunicaciones,
  rawValue: string
) => {
  const updatedServicios = [...servicios];
  // Si es campo de Si/No normalizamos
  const value =
    field === "disponibilidad" ? normalizeYesNo(rawValue) : rawValue;

  updatedServicios[index] = { ...updatedServicios[index], [field]: value };

  // Si cambiamos disponibilidad y ahora es "Si", limpiamos distancia
  if (field === "disponibilidad") {
    const v = String(value).trim().toLowerCase();
    if (v === "si") {
      updatedServicios[index] = {
        ...updatedServicios[index],
        distancia: "", // limpiar la distancia si ahora hay disponibilidad
      };
    }
    // si es "no", dejamos distancia como está (usuario la puede completar)
  }

  setServiciosLocal(updatedServicios);
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

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

  const serviciosConRelevamiento = servicios.map((s) => ({
    ...s,
    relevamiento_id: relevamientoId,
  }));

  setIsSubmitting(true);
  try {
    const response = await fetch(
      editando
        ? `/api/servicios_transporte_comunicaciones/${relevamientoId}` // PATCH
        : "/api/servicios_transporte_comunicaciones", // POST
      {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviciosTransporte: serviciosConRelevamiento }),
      }
    );

    if (response.ok) {
      toast.success(
        editando
          ? "Servicios actualizados correctamente!"
          : "Servicios cargados correctamente!"
      );

      // Refrescar datos desde DB
      const refreshRes = await fetch(
        `/api/servicios_transporte_comunicaciones/${relevamientoId}`
      );
      if (refreshRes.ok) {
        const refreshedData = await refreshRes.json();
        const serviciosNormalizados = (refreshedData.servicios || []).map(
          (s: ServiciosTransporteComunicaciones) => ({
            ...s,
            disponibilidad: s.disponibilidad ?? "",
            en_predio: s.en_predio?.trim() || "",
            distancia: s.distancia ?? "",
          })
        );
        setServiciosLocal(serviciosNormalizados);
        dispatch(setServicios(serviciosNormalizados));
        setEditando(serviciosNormalizados.length > 0);
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


  if (loading) return <ServiciosTransporteSkeleton/>;

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
                      value={servicio[column.key] || ""}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        handleChange(index, column.key, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={
                        column.conditional && !column.conditional(servicio)
                      }
                    >
                      <option value="">Seleccionar</option>
                      {typeof column.options === "function"
                        ? column.options(servicio)?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))
                        : column.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                    </select>
                  )}
                  {column.type === "input" && (
                    <input
                      type="text"
                      value={servicio[column.key] || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, column.key, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={
                        column.conditional && !column.conditional(servicio)
                      }
                    />
                  )}
                  {column.type === "text" && <div>{servicio[column.key]}</div>}
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

export default ServiciosTransporteForm;
