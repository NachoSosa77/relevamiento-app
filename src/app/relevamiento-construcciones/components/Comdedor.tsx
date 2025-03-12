/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { tipoComedorOpciones } from "../config/tipoComerdor";

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

export default function Comedor({
  id,
  label,
  servicios,
  sub_id,
  sublabel,
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
      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2">Sí</th>
            <th className="border p-2">No</th>
            <th className="border p-2"></th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(({ id, question, showCondition }) => (
            <tr key={id} className="border text-sm">
              <td className="border p-2 text-center">{id}</td>
              <td className="border p-2">{question}</td>
              {!showCondition ? (
                <>
                <td className="border p-2 text-center">
                    <div className="grid grid-cols-3 gap-2">
                    {tipoComedorOpciones.map((opcion) => (
                    <label key={opcion.id} className="text-sm">
                        {opcion.prefijo}
                        <input 
                          type="checkbox"
                          name={`disponibilidad-${id}`}
                          value=""
                          onChange={() =>{}}
                         />                         
                    </label>
                      ))}
                      </div>
                </td>
                <td className="border p-2 text-center text-xs bg-slate-200 text-slate-400">
                <p>A - En comedor B - SUM/patio cubierto/gimnasio C - En aulas D - áreas de circulación E - Otro</p>
              </td>
              <td className="border p-2 text-center text-xs bg-slate-200 text-slate-400">
                <p>El servicio se presta en aulas (C): pase al ítem 10. Resto: al ítem 9.3</p>
              </td>
              
                </>
              ) : (
                <>
                  <td className={`border p-2 text-center ${
                  !showCondition ? "bg-slate-200 text-slate-400" : ""
                }`}>
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
                    <input
                      type="radio"
                      name={`disponibilidad-${id}`}
                      value="No"
                      onChange={() =>
                        handleResponseChange(id, "disponibilidad", "No")
                      }
                    />
                  </td>
                  <td className="border p-2 text-center text-xs bg-slate-200 text-slate-400">
                    <p>Si: Pase al ítem 9.2 y complete el cuadro. No: pase al ítem 10</p>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
