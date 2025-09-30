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

// arriba del componente
const normalizeYesNo = (v?: string | null) => {
  if (v === null || v === undefined) return "";
  const t = String(v).trim().toLowerCase();
  if (t === "sí" || t === "si" || t === "s") return "Si";
  if (t === "no" || t === "n") return "No";
  return String(v).trim();
};

const normalizeServicios = (
  dataArray: any[]
): ServiciosTransporteComunicaciones[] => {
  return dataArray.map(
    (s) =>
      ({
        ...s,
        disponibilidad: normalizeYesNo(s.disponibilidad),
        en_predio: s.en_predio ? String(s.en_predio).trim() : "",
        distancia: s.distancia ?? "",
        prestadores: s.prestadores ?? "",
        // Añadir más campos si es necesario
      } as ServiciosTransporteComunicaciones)
  );
};

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

        let datosParaMostrar = serviciosNormalizados;

        if (serviciosNormalizados.length === 0) {
          // Si la API no trajo nada, usamos los servicios iniciales
          datosParaMostrar = serviciosData;
        }

        setServiciosLocal(datosParaMostrar);
        dispatch(setServicios(datosParaMostrar));
        setEditando(datosParaMostrar.length > 0);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, [relevamientoId, dispatch, serviciosData]);

  const handleChange = (
    index: number,
    field: keyof ServiciosTransporteComunicaciones,
    rawValue: string
  ) => {
    const updatedServicios = [...servicios]; // Si es campo de Si/No normalizamos, si no, usamos el valor crudo.
    const value =
      field === "disponibilidad" ? normalizeYesNo(rawValue) : rawValue;

    updatedServicios[index] = { ...updatedServicios[index], [field]: value }; // Lógica condicional: Si cambiamos disponibilidad a "Sí", limpiamos distancia

    if (field === "disponibilidad") {
      const v = String(value).trim().toLowerCase();
      if (v === "sí" || v === "si") {
        updatedServicios[index] = {
          ...updatedServicios[index],
          distancia: "",
        };
      }
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
    } // Preparamos los datos para el envío

    const serviciosConRelevamiento = servicios.map((s) => {
      // Solo necesitamos el ID para el PATCH (actualización) si está en modo edición
      return {
        ...s,
        relevamiento_id: relevamientoId,
      };
    });

    setIsSubmitting(true);
    try {
      // Lógica condicional para decidir la URL y el método
      const method = editando ? "PATCH" : "POST";
      // Si es POST (creación), asumimos que va a la ruta base /api/servicios_transporte_comunicaciones
      // Si es PATCH (actualización), debe ir a la ruta dinámica con el ID
      const url = editando
        ? `/api/servicios_transporte_comunicaciones/${relevamientoId}`
        : `/api/servicios_transporte_comunicaciones`;

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" }, // Usamos la clave serviciosTransporte en el body si es PATCH (esperado por tu backend)
        body: JSON.stringify(
          editando
            ? { serviciosTransporte: serviciosConRelevamiento } // PATCH
            : serviciosConRelevamiento // POST
        ),
      });

      if (response.ok) {
        toast.success(
          editando
            ? "Servicios actualizados correctamente!"
            : "Servicios cargados correctamente!"
        ); // Refrescar datos desde DB

        const refreshRes = await fetch(
          `/api/servicios_transporte_comunicaciones/${relevamientoId}`
        );
        if (refreshRes.ok) {
          const refreshedData = await refreshRes.json();
          const serviciosRefrescados = normalizeServicios(
            refreshedData.servicios || []
          );

          setServiciosLocal(serviciosRefrescados);
          dispatch(setServicios(serviciosRefrescados)); // Si hay datos refrescados, activamos modo edición
          setEditando(serviciosRefrescados.length > 0);
        } else {
          toast.warning(
            "Datos guardados, pero falló la actualización del formulario."
          );
        }
      } else {
        console.error("Error en la respuesta del servidor:", response.status);
        toast.error("Error al guardar los servicios de transporte.");
      }
    } catch (error) {
      toast.error("Error inesperado al enviar los datos.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <ServiciosTransporteSkeleton />;

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
