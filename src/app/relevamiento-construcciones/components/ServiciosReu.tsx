/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

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

export default function ServiciosReu({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
}: ServiciosReuProps) {
  const [responses, setResponses] = useState<
    Record<string, { disponibilidad: string; estado: string }>
  >({});

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
      {
        sub_id !== id && (

          <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200 ">
          <div className="w-6 h-6 flex justify-center text-black font-bold">
            <p>{sub_id}</p>
          </div>
          <div className="h-6 flex items-center justify-center bg-slate-200">
            <p className="px-2 text-sm font-bold">{sublabel}</p>
          </div>
        </div>
          
        )
      }
     
      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2">No</th>
            <th className="border p-2">Sí</th>
            <th className="border p-2">{sub_id === 3.3 ? "" : "Estado de conservación"}</th>
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
              <td className="border p-2 text-center">
                {!showCondition || sub_id === 3.3 ? (
                  <div className="flex gap-2 items-center justify-center">
                    {id === "3.3.1" && (
                      <label>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value="Construcción sin baños"
                          onChange={() =>
                            handleResponseChange(
                              id,
                              "estado",
                              "Construcción sin baños"
                            )
                          }
                          className="mr-1"
                        />
                        Construcción sin baños
                      </label>
                    )}
                    {id === "3.3.2" && (
                      <label>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value="Construcción sin cocina"
                          onChange={() =>
                            handleResponseChange(
                              id,
                              "estado",
                              "Construcción sin cocina"
                            )
                          }
                          className="mr-1"
                        />
                        Construcción sin cocina
                      </label>
                    )}
                    {id === "3.3.3" && (
                      <label>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value="NS"
                          onChange={() => handleResponseChange(id, "estado", "NS")}
                          className="mr-1"
                        />
                        NS
                      </label>
                    )}
                    {id === "3.3.4" && (
                      <label>
                        <input
                          type="radio"
                          name={`estado-${id}`}
                          value="NC"
                          onChange={() => handleResponseChange(id, "estado", "NC")}
                          className="mr-1"
                        />
                        NC
                      </label>
                    )}
                  </div>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
