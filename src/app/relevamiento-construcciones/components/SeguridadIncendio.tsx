/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import TextInput from "@/components/ui/TextInput";
import { useState } from "react";

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
  estado: string;
  cantidad_bocas: string;
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
        estado: string;
        cantidad: string;
        ubicacion: string;
      }
    >
  >({});

  const handleResponseChange = (
    servicioId: string,
    field: "disponibilidad" | "estado" | "cantidad" | "ubicacion",
    value: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [servicioId]: { ...prev[servicioId], [field]: value },
    }));
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
                      <TextInput
                        label={
                          id === "7.2"
                            ? "Cantidad de bocas de incendio"
                            : "Cantidad de salidas"
                        }
                        sublabel=""
                        value={responses[id]?.cantidad || ""}
                        onChange={(e) =>
                          setResponses((prev) => ({
                            ...prev,
                            [id]: { ...prev[id], cantidad: e.target.value },
                          }))
                        }
                      />
                    )}

                    {/* Campos de cantidad y carga de matafuegos para 7.3 - 7.6 */}
                    {(id === "7.3" ||
                      id === "7.4" ||
                      id === "7.5" ||
                      id === "7.6") && (
                      <div className="flex gap-2">
                        <TextInput
                          label="Cantidad"
                          sublabel=""
                          value={responses[id]?.estado || ""}
                          onChange={() =>
                            handleResponseChange(id, "estado", "Regular")
                          }
                        />
                        <div className="flex gap-2 items-center justify-center">
                          ¿Se realiza carga anual de los matafuegos?{" "}
                          <label>
                            <input
                              type="radio"
                              name={`carga-anual-${id}`}
                              value="No"
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
                              name={`carga-anual-${id}`}
                              value="No sabe"
                              onChange={() =>
                                handleResponseChange(
                                  id,
                                  "disponibilidad",
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
                                handleResponseChange(id, "disponibilidad", "Si")
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
                            name={`ubicacion-${id}`}
                            value="En todas"
                            onChange={() =>
                              handleResponseChange(id, "ubicacion", "En todas")
                            }
                            className="mr-1"
                          />
                          En todas
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`ubicacion-${id}`}
                            value="En algunas"
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "ubicacion",
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
                            name={`ubicacion-${id}`}
                            value="En ninguna"
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "ubicacion",
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
                            name={`carga-anual-${id}`}
                            value="No"
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
                            name={`carga-anual-${id}`}
                            value="No sabe"
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "disponibilidad",
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
                              handleResponseChange(id, "disponibilidad", "Si")
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
                            name={`ubicacion-${id}`}
                            value="En todos"
                            onChange={() =>
                              handleResponseChange(id, "ubicacion", "En todos")
                            }
                            className="mr-1"
                          />
                          En todos
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`ubicacion-${id}`}
                            value="En algunos"
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "ubicacion",
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
                            name={`ubicacion-${id}`}
                            value="En ninguno"
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "ubicacion",
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
                            name={`ubicacion-${id}`}
                            value="Ns"
                            onChange={() =>
                              handleResponseChange(id, "ubicacion", "Ns")
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
    </div>
  );
}
