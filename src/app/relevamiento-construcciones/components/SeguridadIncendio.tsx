/* eslint-disable @typescript-eslint/no-explicit-any */
 
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
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

  const relevamientoId = useAppSelector(
      (state) => state.espacio_escolar.relevamientoId
    );

  const handleResponseChange = (
    servicioId: string,
    field: "disponibilidad" | "carga_anual_matafuegos" | "cantidad" | "simulacros_evacuacion",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
  };

  const [cantidadOptions, setCantidadOptions] = useState<{
      [key: string]: number; // Cambiado para ser string porque los IDs de los servicios son strings
    }>({});

  const handleGuardar = async () => {
      const payload = {
        relevamiento_id: relevamientoId,
        servicios: Object.keys(responses).map((key) => ({
          servicio: servicios.find((servicio) => servicio.id === key)?.question || "Unknown",
          disponibilidad: responses[key]?.disponibilidad || "",
          carga_anual_matafuegos: responses[key]?.carga_anual_matafuegos || "",
          cantidad: cantidadOptions[key] || 0,
          simulacros_evacuacion: responses[key]?.simulacros_evacuacion || "",
        })),
      };
    
      console.log("Datos a enviar:", payload);
    
        try {
        const response = await fetch("/api/instalaciones_seguridad_incendio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
    
        if (!response.ok) {
          throw new Error(result.error || "Error al guardar los datos");
        }
    
        toast.success("Relevamiento instalaciones de seguridad e incendio guardado correctamente");
    
        console.log("Respuesta de la API:", result);
      } catch (error: any) {
        console.error("Error al enviar los datos:", error);
        toast.error(error.message || "Error al guardar los datos");
      } 
    }; 

  return (
    <div className="mx-10 text-sm">
      {id !== 0 && (
        <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
          <div className="w-6 h-6 flex justify-center text-white bg-black">
            <p>{id}</p>
          </div>
          <div className="h-6 flex items-center justify-center bg-slate-200">
            <p className="px-2 text-sm font-bold">{label}</p>
          </div>
        </div>
      )}
      {sub_id !== id && (
        <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200 ">
          <div className="w-6 h-6 flex justify-center text-black font-bold">
            <p>{sub_id}</p>
          </div>
          <div className="h-6 flex items-center justify-center bg-slate-200">
            <p className="px-2 text-sm font-bold">{sublabel}</p>
          </div>
        </div>
      )}

      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
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
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`disponibilidad-${id}`}
                  value="No"
                  onChange={() =>
                    handleResponseChange(id, "disponibilidad", "No")
                  }
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`disponibilidad-${id}`}
                  value="Si"
                  onChange={() =>
                    handleResponseChange(id, "disponibilidad", "Si")
                  }
                />
              </td>

              {/* Agregar la columna de "NC" solo si sub_id es 7 */}
              {sub_id === 7 && (
                <td className="border p-2 text-center">
                  {id === "7.2" && (
                    <input
                      type="radio"
                      name={`disponibilidad-${id}`}
                      value="NC"
                      onChange={() =>
                        handleResponseChange(id, "disponibilidad", "NC")
                      }
                    />
                  )}
                </td>
              )}

              {/* Especificaciones */}
              <td
                className={`border p-2 text-center ${
                  !showCondition ? "bg-slate-200 text-slate-400" : ""
                }`}
              >
                {!showCondition ? (
                  "No corresponde"
                ) : (
                  <div className="flex gap-2 items-center justify-center">
                    {/* TextInput para 7.2 y 7.7 */}
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
                        onChange={(value: number | undefined) =>{
                          setCantidadOptions({
                            ...cantidadOptions,
                            [id]: value ?? 0,
                          });
                        }}
                      />
                    )}

                    {/* Campos de cantidad y carga de matafuegos para 7.3 - 7.6 */}
                    {(id === "7.3" ||
                      id === "7.4" ||
                      id === "7.5" ||
                      id === "7.6") && (
                      <div className="flex gap-2">
                        <NumericInput
                        disabled={false}
                          label="Cantidad"
                          subLabel=""
                          value={cantidadOptions[id] || 0}
                          onChange={(value: number | undefined) =>{
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
                              onChange={() =>
                                handleResponseChange(id, "carga_anual_matafuegos", "No")
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
                              onChange={() =>
                                handleResponseChange(id, "carga_anual_matafuegos", "Si")
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
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "disponibilidad",
                                "En algunas"
                              )
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
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "disponibilidad",
                                "En ninguna"
                              )
                            }
                            className="mr-1"
                          />
                          En ninguna
                        </label>
                      </div>
                    )}

                    {/* TextInput para 7.10 */}
                    {id === "7.10" && (
                      <div className="flex gap-2 items-center justify-center">
                        ¿Se realizan simulacros de evacuación?{" "}
                        <label>
                          <input
                            type="radio"
                            name={`simulacros_evacuacion-${id}`}
                            value="No"
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
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "simulacros_evacuacion",
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
                            name={`simulacros_evacuacion-${id}`}
                            value="Si"
                            onChange={() =>
                              handleResponseChange(id, "simulacros_evacuacion", "Si")
                            }
                            className="mr-1"
                          />
                          Si
                        </label>
                      </div>
                    )}

                    {/* TextInput para 7.11 */}
                    {id === "7.11" && (
                      <div className="flex gap-4 items-center justify-center">
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="En todos"
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "No")
                            }
                            className="mr-1"
                          />
                          No
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="Sólo PB"
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "disponibilidad",
                                "Sólo PB"
                              )
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
                            onChange={() =>
                              handleResponseChange(id, "disponibilidad", "Si")
                            }
                            className="mr-1"
                          />
                          Si
                        </label>
                      </div>
                    )}

                    {id === "7.15" && (
                      <div className="flex gap-4 items-center justify-center">
                        <label>
                          <input
                            type="radio"
                            name={`disponibilidad-${id}`}
                            value="En todos"
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
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "disponibilidad",
                                "En algunos"
                              )
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
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "disponibilidad",
                                "En ninguno"
                              )
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
          onClick={handleGuardar}
          className="bg-slate-200 text-sm font-bold px-4 py-2 rounded-md"
        >
          Guardar Información
        </button>
      </div>
    </div>
  );
}
