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

interface EspecificacionesAccesibilidad {
  id?: number;
  estado: string;
  cantidad_bocas: string;
}

export default function CondicionesAccesibilidad({
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
      }
    >
  >({});

  const handleResponseChange = (
    servicioId: string,
    field: "disponibilidad" | "estado" | "cantidad",
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
            <th className="border p-2">Estado y especificaciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(({ id, question, showCondition }) => (
            <tr key={id} className="border text-sm">
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
                    {/* Radios B, R, M */}
                    <div className="flex gap-2 items-center justify-center">
                      <label>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value="Bueno"
                          onChange={() =>
                            handleResponseChange(id, "estado", "Bueno")
                          }
                          className="mr-1"
                        />
                        B
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value="Regular"
                          onChange={() =>
                            handleResponseChange(id, "estado", "Regular")
                          }
                          className="mr-1"
                        />
                        R
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value="Malo"
                          onChange={() =>
                            handleResponseChange(id, "estado", "Malo")
                          }
                          className="mr-1"
                        />
                        M
                      </label>
                    </div>

                    {/* TextInput para 8.1, 8.2, 8.3 */}
                    {(id === "8.1" || id === "8.2" || id === "8.3") && (
                      <div className="flex gap-2 items-center justify-center">
                        <TextInput
                          className="text-sm"
                          label="Cantidad"
                          sublabel=""
                          value={responses[id]?.cantidad || ""}
                          onChange={(e) =>
                            setResponses((prev) => ({
                              ...prev,
                              [id]: { ...prev[id], cantidad: e.target.value },
                            }))
                          }
                        />
                      </div>
                    )}
                    {/* TextInput para 8.1, 8.2, 8.3 */}
                    {(id === "8.1" || id === "8.2") && (
                      <div className="flex gap-2 items-center justify-center">
                        <label>
                        <input
                          type="radio"
                          name={`disponibilidad-${id}-8.3`}
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
                          name={`disponibilidad-${id}`}
                          value="Malo"
                          onChange={() =>
                            handleResponseChange(id, "disponibilidad", "Si")
                          }
                          className="mr-1"
                        />
                        Si
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
