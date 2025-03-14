"use client";

import NumericInput from "@/components/ui/NumericInput";
import { useState } from "react";

interface ResponseData {
  [id: string]: {
    [tipo: string]: {
      cantidad: number;
      estado: string;
    };
  };
}

interface Locales {
  id: string;
  question: string;
  showCondition: boolean;
  opciones: string[];
}

interface EstructuraReuProps {
  id: number;
  label: string;
  locales: Locales[];
}

export default function TableCantidadReutilizable({
  id,
  label,
  locales,
}: EstructuraReuProps) {
  const [responses, setResponses] = useState<ResponseData>({});

  const handleResponseChange = (
    id: string,
    tipo: string,
    field: "cantidad" | "estado",
    value: number | string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [tipo]: { ...prev[id]?.[tipo], [field]: value },
      },
    }));
  };

  return (
    <div className="mx-10 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>{id}</p>
        </div>
        <div className="h-6 flex items-center justify-center bg-slate-200">
          <p className="px-2 text-sm font-bold">{label}</p>
        </div>
      </div>
      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2"></th>
            <th className="border p-2">Ítem</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition, opciones }) => (
              <tr key={id} className="border">
                <td className="border p-2 text-center">{id}</td>
                <td className="border p-2 text-center">{question}</td>
                <td className={` "border p-2 text-center ${!showCondition? "bg-slate-200 text-slate-400" : ""}`}>
                  {!showCondition ? (
                    "No corresponde"
                  ) : (
                    <div className="flex flex-col text-sm">
                      {opciones.map((tipo) => (
                        <span key={tipo} className="border p-1">
                          {tipo}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="border p-2 text-center">
                  {showCondition && opciones.length > 0 ? (
                    opciones.map((tipo) => (
                      <NumericInput
                        disabled={false}
                        key={tipo}
                        label=""
                        subLabel=""
                        value={responses[id]?.[tipo]?.cantidad || ""}
                        onChange={(value) =>
                          handleResponseChange(id, tipo, "cantidad", value)
                        }
                      />
                    ))
                  ) : (
                    <NumericInput
                      disabled={false}
                      label=""
                      subLabel=""
                      value={responses[id]?.["default"]?.cantidad || ""}
                      onChange={(value) =>
                        handleResponseChange(id, "default", "cantidad", value)
                      }
                    />
                  )}
                </td>
                <td className="border p-2 text-center">
                  {showCondition && opciones.length > 0 ? (
                    opciones.map((tipo) => (
                      <div
                        key={tipo}
                        className="flex gap-2 items-center justify-center"
                      >
                        {["B", "R", "M"].map((estado) => (
                          <label key={estado}>
                            <input
                              type="radio"
                              name={`estado-${id}-${tipo}`}
                              value={estado}
                              checked={responses[id]?.[tipo]?.estado === estado}
                              onChange={() =>
                                handleResponseChange(id, tipo, "estado", estado)
                              }
                              className="mr-1"
                            />
                            {estado}
                          </label>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-2 items-center justify-center">
                      {["B", "R", "M"].map((estado) => (
                        <label key={estado}>
                          <input
                            type="radio"
                            name={`estado-${id}-default`}
                            value={estado}
                            checked={
                              responses[id]?.["default"]?.estado === estado
                            }
                            onChange={() =>
                              handleResponseChange(
                                id,
                                "default",
                                "estado",
                                estado
                              )
                            }
                            className="mr-1"
                          />
                          {estado}
                        </label>
                      ))}
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
