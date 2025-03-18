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

export default function IluminacionVentilacion({
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
            <th className="border p-2"></th>
            <th className="border p-2">Si</th>
            <th className="border p-2">No</th>
          </tr>
        </thead>
        <tbody>
          {locales.map(({ id, question, showCondition }) => (
            <tr key={id} className="border">
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2 text-center">{question}</td>
              <td className="border p-2 text-center">
                {showCondition ? (
                  <label>
                    <input
                      type="radio"
                      name={`estado-${id}`}
                      value={""}
                      checked={false}
                      onChange={() => {}}
                      className="mr-1"
                    />
                    Si
                  </label>
                ) : (
                  <NumericInput
                    disabled={false}
                    label={"Superficie de iluminación"}
                    subLabel="m2"
                    value={responses[id]?.["default"]?.cantidad || ""}
                    onChange={(value) =>
                      handleResponseChange(id, "default", "cantidad", value)
                    }
                  />
                )}
              </td>
              <td className="border p-2 text-center">
                {showCondition ? (
                   <label>
                   <input
                     type="radio"
                     name={`estado-${id}`}
                     value={""}
                     checked={false}
                     onChange={() => {}}
                     className="mr-1"
                   />
                   No
                 </label>
                ) : (
                  <NumericInput
                    disabled={false}
                    label="Superficie de ventilación"
                    subLabel="m2"
                    value={responses[id]?.["default"]?.cantidad || ""}
                    onChange={(value) =>
                      handleResponseChange(id, "default", "cantidad", value)
                    }
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
