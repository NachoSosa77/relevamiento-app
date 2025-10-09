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

/** Normaliza Sí/No a forma con tilde para que matchee <option> "Sí" | "No" */
const normalizeYesNo = (v?: string | null) => {
  if (v === null || v === undefined) return "";
  const t = String(v).trim().toLowerCase();
  if (t === "sí" || t === "si" || t === "s") return "Sí";
  if (t === "no" || t === "n") return "No";
  return String(v).trim();
};

/** Normaliza filas provenientes de DB a lo que espera la UI */
const normalizeServicios = (dataArray: any[]): ServiciosTransporteComunicaciones[] => {
  return dataArray.map((s: any) => {
    // en_predio: sólo normalizamos a “Sí/No” si NO es 3.2 (frecuencia)
    const enPredio =
      s.id_servicio === "3.2"
        ? (s.en_predio ?? "")?.toString().trim()
        : normalizeYesNo(s.en_predio);

    return {
      ...s,
      en_predio: enPredio || "",
      disponibilidad: normalizeYesNo(s.disponibilidad),
      distancia: s.distancia ?? "",
      prestadores: s.prestadores ?? "", // si no existe en tu modelo, no afecta
    } as ServiciosTransporteComunicaciones;
  });
};

const ServiciosTransporteForm: React.FC<ServiciosTransporteFormProps> = ({
  serviciosData,
  columnsConfig,
}) => {
  const dispatch = useDispatch();
  const relevamientoId = useRelevamientoId();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbHasData, setDbHasData] = useState(false);
  const [servicios, setServiciosLocal] =
    useState<ServiciosTransporteComunicaciones[]>(serviciosData);

  // Cargar datos existentes desde DB
  useEffect(() => {
    if (!relevamientoId) return;

    const fetchServicios = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/servicios_transporte_comunicaciones/${relevamientoId}`
        );

        if (res.status === 404) {
          // No hay datos en DB → usar los iniciales del catálogo
          setDbHasData(false);
          setServiciosLocal(serviciosData);
          dispatch(setServicios(serviciosData));
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const serviciosNormalizados = normalizeServicios(data.servicios || []);

        if (serviciosNormalizados.length === 0) {
          setDbHasData(false);
          setServiciosLocal(serviciosData);
          dispatch(setServicios(serviciosData));
        } else {
          setDbHasData(true);
          setServiciosLocal(serviciosNormalizados);
          dispatch(setServicios(serviciosNormalizados));
        }
      } catch (error) {
        console.error("Error al cargar servicios:", error);
        setDbHasData(false);
        setServiciosLocal(serviciosData);
        dispatch(setServicios(serviciosData));
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
    const updated = [...servicios];

    // disponibilidad es Sí/No con tilde
    const value =
      field === "disponibilidad" ? normalizeYesNo(rawValue) : rawValue;

    updated[index] = { ...updated[index], [field]: value };

    // Si disponibilidad pasó a “Sí”, limpiamos distancia
    if (field === "disponibilidad") {
      const v = String(value).trim().toLowerCase(); // "sí" | "no" | otro
      if (v === "sí") {
        updated[index] = { ...updated[index], distancia: "" };
      }
    }

    // Si cambió en_predio y NO es 3.2, normalizamos a “Sí/No” (con tilde)
    if (field === "en_predio" && updated[index].id_servicio !== "3.2") {
      updated[index] = {
        ...updated[index],
        en_predio: normalizeYesNo(value),
      };
    }

    setServiciosLocal(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Algún campo no-text con valor
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
      const method = dbHasData ? "PATCH" : "POST";
      const url = dbHasData
        ? `/api/servicios_transporte_comunicaciones/${relevamientoId}`
        : `/api/servicios_transporte_comunicaciones`;

      const body = dbHasData
        ? { serviciosTransporte: serviciosConRelevamiento } // PATCH shape (upsert)
        : serviciosConRelevamiento; // POST shape (bulk insert)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error("Error en la respuesta del servidor:", response.status);
        toast.error("Error al guardar los servicios de transporte.");
        return;
      }

      toast.success(
        dbHasData
          ? "Servicios actualizados correctamente!"
          : "Servicios cargados correctamente!"
      );

      // 🔁 Refrescar desde DB para activar banner y mostrar lo persistido
      const refreshRes = await fetch(
        `/api/servicios_transporte_comunicaciones/${relevamientoId}`
      );
      if (refreshRes.ok) {
        const refreshedData = await refreshRes.json();
        const serviciosRefrescados = normalizeServicios(
          refreshedData.servicios || []
        );
        setServiciosLocal(serviciosRefrescados);
        dispatch(setServicios(serviciosRefrescados));
        setDbHasData(serviciosRefrescados.length > 0);
      } else if (refreshRes.status === 404) {
        setDbHasData(false);
      } else {
        toast.warning(
          "Datos guardados, pero falló la actualización del formulario."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al enviar los datos.");
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
          {isSubmitting ? "Guardando..." : dbHasData ? "Actualizar información" : "Guardar información"}
        </button>
      </div>
    </form>
  );
};

export default ServiciosTransporteForm;
