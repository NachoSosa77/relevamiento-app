/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import { useState } from "react";
import { tipoTratamientoOpciones } from "../config/tipoTratamiento";

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

interface TratamientoAgua {
  id?: number;
  tratamiento: string;
  control: string;
}

export default function CalidadAgua({
  id,
  label,
  sub_id,
  sublabel,
  servicios,
}: ServiciosReuProps) {
  const [responses, setResponses] = useState<
    Record<string, { disponibilidad: string; estado: string }>
  >({});

  const [tratamiento, setTratamiento] = useState<TratamientoAgua>({
    tratamiento: "",
    control: "",
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
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200 ">
        <div className="w-6 h-6 flex justify-center text-black font-bold">
          <p>{sub_id}</p>
        </div>
        <div className="h-6 flex items-center justify-center bg-slate-200">
          <p className="px-2 text-sm font-bold">{sublabel}</p>
        </div>
      </div>
      <div className="flex flex-col p-2 justify-center items-cente text-xs bg-slate-200 text-slate-400">
        <p>
          Formule las preguntas tal como están redactadas y registre la
          respuesta. En caso de respuesta afirmativa al item 3.4.1 pregunte ¿Qué
          tipo de tratamiento se realiza? y en caso de respuesta afirmativa al
          ítem 3.4.2 pregunte ¿Cúantas veces al año se realiza?
        </p>
      </div>
      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2">No</th>
            <th className="border p-2">NC</th>
            <th className="border p-2">NS</th>
            <th className="border p-2">Si</th>
            <th className="border p-2">Tipo de tratamiento</th>
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
                {showCondition && (
                  <input
                    type="radio"
                    name={`disponibilidad-${id}`}
                    value="NC"
                    onChange={() =>
                      handleResponseChange(id, "disponibilidad", "Nc")
                    }
                  />
                )}
              </td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`disponibilidad-${id}`}
                  value="NS"
                  onChange={() =>
                    handleResponseChange(id, "disponibilidad", "Ns")
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
              <td>
                {showCondition ? (
                  <Select
                    label=""
                    options={tipoTratamientoOpciones.map((option) => ({
                      value: option.id,
                      label: option.name,
                    }))}
                    value={tratamiento.tratamiento}
                    onChange={(e) =>
                      setTratamiento({
                        ...tratamiento,
                        tratamiento: e.target.value,
                      })
                    }
                  />
                ) : (
                  <TextInput
                    label=""
                    sublabel=""
                    value={""}
                    onChange={(e) => {}}
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
