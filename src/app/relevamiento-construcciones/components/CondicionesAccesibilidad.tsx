/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use client";

import NumericInput from "@/components/ui/NumericInput";
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
  construccionId: number | null;
}

interface RespuestaAccesibilidad {
  id?: number;
  disponibilidad: string;
  estado: string;
  cantidad: number;
  mantenimiento: string;
}

export default function CondicionesAccesibilidad({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
  construccionId,
}: ServiciosReuProps) {
  const relevamientoId = useRelevamientoId();

  const [responses, setResponses] = useState<Record<string, RespuestaAccesibilidad>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editando, setEditando] = useState(false);

  // Cargar datos existentes para editar
  useEffect(() => {
    if (!relevamientoId || !construccionId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/condiciones_accesibilidad?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Mapeamos las respuestas para el estado local
            const initialResponses: Record<string, RespuestaAccesibilidad> = {};
            data.forEach((item: any) => {
              // Asumimos que item.servicio_id o similar está para clave, sino usamos item.servicio o index
              const servicioId = item.servicio_id || item.servicio || item.id?.toString() || "";
              initialResponses[servicioId] = {
                id: item.id,
                disponibilidad: item.disponibilidad || "",
                estado: item.estado || "",
                cantidad: item.cantidad || 0,
                mantenimiento: item.mantenimiento || "",
              };
            });
            setResponses(initialResponses);
            setEditando(true);
          }
        }
      } catch (error) {
        console.error("Error al cargar condiciones accesibilidad:", error);
      }
    };

    fetchData();
  }, [relevamientoId, construccionId]);

  const handleResponseChange = (
    servicioId: string,
    field: keyof RespuestaAccesibilidad,
    value: string | number
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  const handleGuardar = async () => {
    // Validar que haya al menos un servicio con datos válidos
    const serviciosValidos = Object.keys(responses).filter((key) => {
      const r = responses[key];
      return (
        r?.disponibilidad.trim() !== "" ||
        r?.estado.trim() !== "" ||
        r?.cantidad > 0 ||
        r?.mantenimiento.trim() !== ""
      );
    });

    if (serviciosValidos.length === 0) {
      toast.warning("Debe completar al menos un servicio con datos antes de guardar");
      return;
    }

    // Armar payload con id si editando para PATCH
    const payload = {
      relevamiento_id: relevamientoId,
      construccion_id: construccionId,
      servicios: serviciosValidos.map((key) => ({
        id: responses[key].id, // puede ser undefined para POST
        servicio: servicios.find((servicio) => servicio.id === key)?.question || "Unknown",
        disponibilidad: responses[key].disponibilidad,
        estado: responses[key].estado,
        cantidad: responses[key].cantidad,
        mantenimiento: responses[key].mantenimiento,
      })),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/condiciones_accesibilidad", {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar los datos");
      }

      toast.success(
        editando
          ? "Datos de condiciones accesibilidad actualizados correctamente"
          : "Datos de condiciones accesibilidad guardados correctamente"
      );

      // Si se guardó nuevo, ahora estamos editando
      if (!editando) setEditando(true);
    } catch (error: any) {
      console.error("Error al enviar los datos:", error);
      toast.error(error.message || "Error al guardar los datos");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      {editando && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mt-2 rounded">
          Estás editando un registro ya existente.
        </div>
      )}
      {id !== 0 && (
        <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
          <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
            <p>{id}</p>
          </div>
          <div className="h-6 flex items-center justify-center">
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

      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-custom text-white">
            <th className="border p-2"></th>
            <th className="border p-2">TIPO DE PROVISIÓN</th>
            <th className="border p-2">No</th>
            <th className="border p-2">Sí</th>
            <th className="border p-2">Estado y especificaciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(({ id, question, showCondition }) => {
            const r = responses[id] || {
              disponibilidad: "",
              estado: "",
              cantidad: 0,
              mantenimiento: "",
            };
            return (
              <tr key={id} className="border text-sm">
                <td className="border p-2 text-center">{id}</td>
                <td className="border p-2">{question}</td>
                <td className="border p-2 text-center">
                  <input
                    type="radio"
                    name={`disponibilidad-${id}`}
                    value="No"
                    checked={r.disponibilidad === "No"}
                    onChange={() => handleResponseChange(id, "disponibilidad", "No")}
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="radio"
                    name={`disponibilidad-${id}`}
                    value="Si"
                    checked={r.disponibilidad === "Si"}
                    onChange={() => handleResponseChange(id, "disponibilidad", "Si")}
                  />
                </td>

                <td
                  className={`border p-2 text-center ${
                    !showCondition ? "bg-slate-200 text-slate-400" : ""
                  }`}
                >
                  {!showCondition ? (
                    "No corresponde"
                  ) : (
                    <div className="flex gap-2 items-center justify-center">
                      {/* Radios B, R, M */}
                      <div className="flex gap-2 items-center justify-center">
                        <label>
                          <input
                            type="radio"
                            name={`estado-${id}`}
                            value="Bueno"
                            checked={r.estado === "Bueno"}
                            onChange={() => handleResponseChange(id, "estado", "Bueno")}
                            className="mr-1"
                          />
                          B
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`estado-${id}`}
                            value="Regular"
                            checked={r.estado === "Regular"}
                            onChange={() => handleResponseChange(id, "estado", "Regular")}
                            className="mr-1"
                          />
                          R
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`estado-${id}`}
                            value="Malo"
                            checked={r.estado === "Malo"}
                            onChange={() => handleResponseChange(id, "estado", "Malo")}
                            className="mr-1"
                          />
                          M
                        </label>
                      </div>

                      {/* NumericInput para cantidades */}
                      {(id === "8.1" || id === "8.2" || id === "8.3") && (
                        <div className="flex gap-2 items-center justify-center">
                          <p className="text-xs font-bold">Cantidad</p>
                          <NumericInput
                            disabled={false}
                            label=""
                            subLabel=""
                            value={r.cantidad}
                            onChange={(value: number | undefined) =>
                              handleResponseChange(id, "cantidad", value ?? 0)
                            }
                          />
                        </div>
                      )}

                      {/* Mantenimiento */}
                      {(id === "8.1" || id === "8.2") && (
                        <div className="flex gap-2 items-center justify-center">
                          <p className="text-xs font-bold">¿Se realiza mantenimiento?</p>
                          <label>
                            <input
                              type="radio"
                              name={`mantenimiento-${id}`}
                              value="No"
                              checked={r.mantenimiento === "No"}
                              onChange={() => handleResponseChange(id, "mantenimiento", "No")}
                              className="mr-1"
                            />
                            No
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`mantenimiento-${id}`}
                              value="Si"
                              checked={r.mantenimiento === "Si"}
                              onChange={() => handleResponseChange(id, "mantenimiento", "Si")}
                              className="mr-1"
                            />
                            Sí
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleGuardar}
          disabled={isSubmitting}
          className="bg-custom hover:bg-custom/50 text-white text-sm font-bold px-4 py-2 rounded-md"
        >
          {isSubmitting ? "Guardando..." : "Guardar información"}
        </button>
      </div>
    </div>
  );
}
