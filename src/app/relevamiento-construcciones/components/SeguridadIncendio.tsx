/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

interface EspecificacionesSeguridadIncendio {
  id?: number;
  servicio: string;
  disponibilidad: string;
  cantidad: number;
  carga_anual_matafuegos: string;
  simulacros_evacuacion: string;
}

export default function SeguridadIncendio({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
  construccionId,
}: ServiciosReuProps) {
  const [responses, setResponses] = useState<
    Record<
      string,
      {
        disponibilidad: string;
        cantidad: number;
        carga_anual_matafuegos: string;
        simulacros_evacuacion: string;
      }
    >
  >({});
  const [cantidadOptions, setCantidadOptions] = useState<Record<string, number>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const relevamientoId = useRelevamientoId();
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (!relevamientoId || !construccionId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/instalaciones_seguridad_incendio?relevamiento_id=${relevamientoId}&construccion_id=${construccionId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const initialResponses: typeof responses = {};
            const initialCantidades: typeof cantidadOptions = {};

            data.forEach((item: any) => {
              const servicioId = item.servicio_id || item.id || item.servicio;
              if (!servicioId) return;

              initialResponses[servicioId] = {
                disponibilidad: item.disponibilidad || "",
                cantidad: item.cantidad || 0,
                carga_anual_matafuegos: item.carga_anual_matafuegos || "",
                simulacros_evacuacion: item.simulacros_evacuacion || "",
              };

              initialCantidades[servicioId] = item.cantidad || 0;
            });

            setResponses(initialResponses);
            setCantidadOptions(initialCantidades);
            setEditando(true);
          } else {
            // Si no hay datos, limpiar estados
            setResponses({});
            setCantidadOptions({});
            setEditando(false);
          }
        }
      } catch (error) {
        console.error("Error cargando datos existentes de seguridad incendio:", error);
      }
    };

    fetchData();
  }, [relevamientoId, construccionId]);

  const handleResponseChange = (
    servicioId: string,
    field:
      | "disponibilidad"
      | "carga_anual_matafuegos"
      | "cantidad"
      | "simulacros_evacuacion",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  const handleGuardar = async () => {
    // Filtrar solo servicios con datos válidos
    const serviciosValidos = Object.keys(responses).filter((key) => {
      const r = responses[key];
      const cantidad = cantidadOptions[key] ?? 0;

      return (
        (r?.disponibilidad && r.disponibilidad.trim() !== "") ||
        cantidad > 0 ||
        (r?.carga_anual_matafuegos && r.carga_anual_matafuegos.trim() !== "") ||
        (r?.simulacros_evacuacion && r.simulacros_evacuacion.trim() !== "")
      );
    });

    if (serviciosValidos.length === 0) {
      toast.warning(
        "Debe completar al menos un servicio con datos antes de guardar"
      );
      return;
    }

    const payload = {
      relevamiento_id: relevamientoId,
      construccion_id: construccionId,
      servicios: serviciosValidos.map((key) => ({
        servicio:
          servicios.find((servicio) => servicio.id === key)?.question ||
          "Unknown",
        disponibilidad: responses[key]?.disponibilidad || "",
        carga_anual_matafuegos: responses[key]?.carga_anual_matafuegos || "",
        cantidad: cantidadOptions[key] || 0,
        simulacros_evacuacion: responses[key]?.simulacros_evacuacion || "",
      })),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/instalaciones_seguridad_incendio", {
        method: editando ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar los datos");
      }

      toast.success(
        "Relevamiento instalaciones de seguridad e incendio guardado correctamente"
      );
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
          <div className="h-6 flex items-center justify-center ">
            <p className="px-2 text-sm font-bold">{label}</p>
          </div>
        </div>
      )}
      {sub_id !== id && (
        <div className="flex items-center gap-2 mt-2 p-2 border  ">
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
            {sub_id === 7 && <th className="border p-2">Nc</th>}
            <th className="border p-2">Especificaciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(({ id, question, showCondition }) => (
            <tr key={id} className="border">
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>

              {/* Radios No */}
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`disponibilidad-${id}`}
                  value="No"
                  checked={responses[id]?.disponibilidad === "No"}
                  onChange={() => handleResponseChange(id, "disponibilidad", "No")}
                />
              </td>

              {/* Radios Si */}
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`disponibilidad-${id}`}
                  value="Si"
                  checked={responses[id]?.disponibilidad === "Si"}
                  onChange={() => handleResponseChange(id, "disponibilidad", "Si")}
                />
              </td>

              {/* Radio NC solo si sub_id === 7 */}
              {sub_id === 7 && (
                <td className="border p-2 text-center">
                  {id === "7.2" && (
                    <input
                      type="radio"
                      name={`disponibilidad-${id}`}
                      value="NC"
                      checked={responses[id]?.disponibilidad === "NC"}
                      onChange={() => handleResponseChange(id, "disponibilidad", "NC")}
                    />
                  )}
                </td>
              )}

              {/* Especificaciones */}
              <td
                className={`border p-2 text-center ${
                  !showCondition ? "text-slate-400" : ""
                }`}
              >
                {!showCondition ? (
                  "No corresponde"
                ) : (
                  <div className="flex gap-2 items-center justify-center">
                    {/* NumericInput para 7.2 y 7.7 */}
                    {(id === "7.2" || id === "7.7") && (
                      <NumericInput
                        disabled={false}
                        label={
                          id === "7.2"
                            ? "Cantidad de bocas de incendio"
                            : "Cantidad de salidas"
                        }
                        subLabel=""
                        value={cantidadOptions[id] || 0}
                        onChange={(value: number | undefined) => {
                          setCantidadOptions({
                            ...cantidadOptions,
                            [id]: value ?? 0,
                          });
                        }}
                      />
                    )}

                    {/* Cantidad + carga anual para 7.3 a 7.6 */}
                    {(id === "7.3" ||
                      id === "7.4" ||
                      id === "7.5" ||
                      id === "7.6") && (
                      <div className="flex gap-2 items-center justify-center">
                        <NumericInput
                          disabled={false}
                          label="Cantidad"
                          subLabel=""
                          value={cantidadOptions[id] || 0}
                          onChange={(value: number | undefined) => {
                            setCantidadOptions({
                              ...cantidadOptions,
                              [id]: value ?? 0,
                            });
                          }}
                        />
                        <div className="flex gap-2 items-center justify-center">
                          ¿Se realiza carga anual de los matafuegos?{" "}
                          <label>
                            <input
                              type="radio"
                              name={`carga-anual-${id}`}
                              value="No"
                              checked={responses[id]?.carga_anual_matafuegos === "No"}
                              onChange={() =>
                                handleResponseChange(
                                  id,
                                  "carga_anual_matafuegos",
                                  "No"
                                )
                              }
                              className="mr-1"
                            />
                            No
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`carga-anual-${id}`}
                              value="No sabe"
                              checked={responses[id]?.carga_anual_matafuegos === "No sabe"}
                              onChange={() =>
                                handleResponseChange(
                                  id,
                                  "carga_anual_matafuegos",
                                  "No sabe"
                                )
                              }
                              className="mr-1"
                            />
                            NS
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`carga-anual-${id}`}
                              value="Si"
                              checked={responses[id]?.carga_anual_matafuegos === "Si"}
                              onChange={() =>
                                handleResponseChange(
                                  id,
                                  "carga_anual_matafuegos",
                                  "Si"
                                )
                              }
                              className="mr-1"
                            />
                            Si
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Opciones especiales para 7.8 */}
                    {id === "7.8" && (
                      <div className="flex gap-4 items-center justify-center">
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="En todas"
                            checked={responses[id]?.disponibilidad === "En todas"}
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "En todas")
                            }
                            className="mr-1"
                          />
                          En todas
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="En algunas"
                            checked={responses[id]?.disponibilidad === "En algunas"}
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "En algunas")
                            }
                            className="mr-1"
                          />
                          En algunas
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="En ninguna"
                            checked={responses[id]?.disponibilidad === "En ninguna"}
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "En ninguna")
                            }
                            className="mr-1"
                          />
                          En ninguna
                        </label>
                      </div>
                    )}

                    {/* Simulacros para 7.10 */}
                    {id === "7.10" && (
                      <div className="flex gap-2 items-center justify-center">
                        ¿Se realizan simulacros de evacuación?{" "}
                        <label>
                          <input
                            type="radio"
                            name={`simulacros_evacuacion-${id}`}
                            value="No"
                            checked={responses[id]?.simulacros_evacuacion === "No"}
                            onChange={() =>
                              handleResponseChange(id, "simulacros_evacuacion", "No")
                            }
                            className="mr-1"
                          />
                          No
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`simulacros_evacuacion-${id}`}
                            value="No sabe"
                            checked={responses[id]?.simulacros_evacuacion === "No sabe"}
                            onChange={() =>
                              handleResponseChange(id, "simulacros_evacuacion", "No sabe")
                            }
                            className="mr-1"
                          />
                          NS
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`simulacros_evacuacion-${id}`}
                            value="Si"
                            checked={responses[id]?.simulacros_evacuacion === "Si"}
                            onChange={() =>
                              handleResponseChange(id, "simulacros_evacuacion", "Si")
                            }
                            className="mr-1"
                          />
                          Si
                        </label>
                      </div>
                    )}

                    {/* Opciones especiales para 7.11 */}
                    {id === "7.11" && (
                      <div className="flex gap-4 items-center justify-center">
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="En todos"
                            checked={responses[id]?.disponibilidad === "En todos"}
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "En todos")
                            }
                            className="mr-1"
                          />
                          En todos
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="Sólo PB"
                            checked={responses[id]?.disponibilidad === "Sólo PB"}
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "Sólo PB")
                            }
                            className="mr-1"
                          />
                          Sólo PB
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="En ninguno"
                            checked={responses[id]?.disponibilidad === "En ninguno"}
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "En ninguno")
                            }
                            className="mr-1"
                          />
                          En ninguno
                        </label>
                      </div>
                    )}

                    {/* Opciones especiales para 7.15 */}
                    {id === "7.15" && (
                      <div className="flex gap-4 items-center justify-center">
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="En todos"
                            checked={responses[id]?.disponibilidad === "En todos"}
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "En todos")
                            }
                            className="mr-1"
                          />
                          En todos
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="En algunos"
                            checked={responses[id]?.disponibilidad === "En algunos"}
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "En algunos")
                            }
                            className="mr-1"
                          />
                          En algunos
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="En ninguno"
                            checked={responses[id]?.disponibilidad === "En ninguno"}
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "En ninguno")
                            }
                            className="mr-1"
                          />
                          En ninguno
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="Ns"
                            checked={responses[id]?.disponibilidad === "Ns"}
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "Ns")
                            }
                            className="mr-1"
                          />
                          NS
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button
          disabled={isSubmitting}
          onClick={handleGuardar}
          className="text-white text-sm bg-custom hover:bg-custom/50 font-bold p-2 rounded-lg"
        >
          {isSubmitting ? "Guardando..." : "Guardar información"}
        </button>
      </div>
    </div>
  );
}
