/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import { useState } from "react";
import { tipoCombustibleOpciones } from "../config/tipoCombustible";

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

interface EspecificacionesElectricidad {
  id?: number;
  potencia: string;
  tipoCombustible: string;
  estado_bateria?: string;
}

export default function ElectricidadServicio({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
}: ServiciosReuProps) {
  const [responses, setResponses] = useState<
    Record<string, { disponibilidad: string; estado: string }>
  >({});

  const [combustipleOption, setcCombustibleOption] =
    useState<EspecificacionesElectricidad>({
      potencia: "",
      tipoCombustible: "",
      estado_bateria: "",
    });

  const handleResponseChange = (
    servicioId: string,
    field: "disponibilidad" | "estado",
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
            <th className="border p-2"></th>
            <th className="border p-2">No</th>
            <th className="border p-2">Sí</th>
            {sub_id === 6.2 && <th className="border p-2">NS</th>}
            {sub_id !== 6.2 && <th className="border p-2">Estado</th>}
            {sub_id !== 6.2 && <th className="border p-2">Especificaciones</th>}
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
              {id === "6.2.4" || id === "6.2.8" ? (
                <td className="border p-2 text-center">
                  <input
                    type="radio"
                    name={`disponibilidad-${id}`}
                    value="NS"
                    onChange={() =>
                      handleResponseChange(id, "disponibilidad", "NS")
                    }
                  />
                </td>
              ) : null}
              {sub_id !== 6.2 && (
                <td
                  className={`border p-2 text-center ${
                    !showCondition ? "bg-slate-200 text-slate-400" : ""
                  }`}
                >
                  {!showCondition ? (
                    "No corresponde"
                  ) : (
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
                  )}
                </td>
              )}
              {sub_id !== 6.2 && (
                <td
                  className={`border p-2 text-center ${
                    !showCondition ? "bg-slate-200 text-slate-400" : ""
                  }`}
                >
                  {!showCondition ? (
                    "No corresponde"
                  ) : (
                    <div className="flex gap-2 items-center justify-center">
                      <label>
                        <TextInput
                          label=""
                          sublabel=""
                          value="Regular"
                          onChange={() =>
                            handleResponseChange(id, "estado", "Regular")
                          }
                        />
                      </label>
                      {id === "6.1.2" ? (
                        <label className="flex items-center justify-center gap-2">
                          Tipo de combustible
                          <Select
                            label=""
                            options={tipoCombustibleOpciones.map((option) => ({
                              value: option.id,
                              label: option.name,
                            }))}
                            value={combustipleOption.tipoCombustible}
                            onChange={(e) =>
                              setcCombustibleOption({
                                ...combustipleOption,
                                tipoCombustible: e.target.value,
                              })
                            }
                          />
                        </label>
                      ) : (
                        <div className="flex gap-2 items-center justify-center">
                          Estado baterías{" "}
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
                      )}
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
