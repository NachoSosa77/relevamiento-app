"use client";

import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Servicio {
  id: string;
  question: string;
  showCondition: boolean;
}

interface ServiciosReuProps {
  id: number;
  label: string;
  sub_id: number;
  sublabel: string;
  servicios: Servicio[];
  endpoint: string;
  construccionId: number | null;
}

export default function ServiciosReu({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
  endpoint,
  construccionId,
}: ServiciosReuProps) {
  const [selectedServicios, setSelectedServicios] = useState<
    { servicio: string; estado?: string }[]
  >([]);
  const relevamientoId = useRelevamientoId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true); // 👈 skeleton

  // Cargar datos existentes
  useEffect(() => {
    if (!relevamientoId || !construccionId) {
      setCargandoDatos(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${endpoint}?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
        );
        if (res.ok) {
          const data = await res.json();

          if (Array.isArray(data) && data.length > 0) {
            setEditando(true);

            // Precargar servicios desde backend
            const precargados = data.map((item: any) => ({
              servicio: item.servicio,
              estado: item.estado || "",
            }));
            setSelectedServicios(precargados);
          }
        }
      } catch (error) {
        console.error("Error cargando servicios existentes:", error);
      } finally {
        setCargandoDatos(false); // 👈 siempre apagamos skeleton
      }
    };

    fetchData();
  }, [relevamientoId, construccionId, endpoint]);

  // Selección de servicios
  const handleServicioSelect = (servicioId: string) => {
    const servicio = servicios.find((s) => s.id === servicioId);
    if (!servicio) return;
    const alreadySelected = selectedServicios.some(
      (s) => s.servicio === servicio.question
    );
    if (!alreadySelected) {
      setSelectedServicios((prev) => [
        ...prev,
        { servicio: servicio.question },
      ]);
    }
  };

  // Cambio de estado
  const handleEstadoChange = (servicioQuestion: string, estado: string) => {
    setSelectedServicios((prev) =>
      prev.map((s) => (s.servicio === servicioQuestion ? { ...s, estado } : s))
    );
  };

  // Guardar
  const handleGuardar = async () => {
    if (selectedServicios.length === 0) {
      toast.warning("Debes seleccionar al menos un servicio antes de guardar.");
      return;
    }

    for (const servicio of selectedServicios) {
      const config = servicios.find((s) => s.question === servicio.servicio);
      if (config?.showCondition && !servicio.estado) {
        toast.warning(
          `Debes seleccionar un estado para el servicio: "${servicio.servicio}".`
        );
        return;
      }
    }

    const payload = {
      relevamiento_id: relevamientoId,
      construccion_id: construccionId,
      servicios: selectedServicios.map(({ servicio, estado }) => ({
        servicio,
        estado,
      })),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method: editando ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al guardar los servicios");
      }

      toast.success("Servicios guardados exitosamente");
      setEditando(true);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.error("Error al guardar los servicios. Inténtalo nuevamente.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      {editando && !cargandoDatos && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mt-2 rounded">
          Estás editando un registro ya existente.
        </div>
      )}

      {id !== 0 && (
        <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
          <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
            <p>{id}</p>
          </div>
          <div className="h-6 flex items-center justify-center ">
            <p className="px-2 text-sm font-bold">{label}</p>
          </div>
        </div>
      )}

      {sub_id !== id && (
        <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
          <div className="w-6 h-6 flex justify-center text-black font-bold">
            <p>{sub_id}</p>
          </div>
          <div className="h-6 flex items-center justify-center ">
            <p className="px-2 text-sm font-bold">{sublabel}</p>
          </div>
        </div>
      )}

      {cargandoDatos ? (
        // 👇 Skeleton
        <div className="flex flex-col gap-4 p-4">
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      ) : (
        <>
          <table className="w-full border mt-2 text-xs">
            <thead>
              <tr className="bg-custom text-white">
                <th className="border p-2">Servicio</th>
                <th className="border p-2">Estado (si corresponde)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2" colSpan={2}>
                  <select
                    onChange={(e) => handleServicioSelect(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Seleccionar servicio</option>
                    {servicios.map((servicio) => (
                      <option key={servicio.id} value={servicio.id}>
                        {servicio.question}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              {selectedServicios.map(({ servicio, estado }, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <select
                      value={servicio}
                      onChange={(e) => {
                        const newServicio = servicios.find(
                          (s) => s.question === e.target.value
                        )?.question;
                        setSelectedServicios((prev) =>
                          prev.map((s, i) =>
                            i === index
                              ? { ...s, servicio: newServicio || s.servicio }
                              : s
                          )
                        );
                      }}
                      className="w-full p-2 border rounded"
                    >
                      {servicios.map((s) => (
                        <option key={s.id} value={s.question}>
                          {s.question}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2">
                    {servicios.find((s) => s.question === servicio)
                      ?.showCondition ? (
                      <select
                        value={estado || ""}
                        onChange={(e) =>
                          handleEstadoChange(servicio, e.target.value)
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Seleccionar estado</option>
                        <option value="Bueno">Bueno</option>
                        <option value="Regular">Regular</option>
                        <option value="Malo">Malo</option>
                      </select>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleGuardar}
              disabled={isSubmitting}
              className="text-sm text-white bg-custom hover:bg-custom/50 font-bold p-2 rounded-lg"
            >
              {isSubmitting
                ? editando
                  ? "Actualizando..."
                  : "Guardando..."
                : editando
                ? "Actualizar información"
                : "Guardar información"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
