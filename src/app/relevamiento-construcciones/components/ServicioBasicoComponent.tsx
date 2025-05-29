"use client";

import Select from "@/components/ui/SelectComponent";
import { useCallback, useState } from "react";
import {
  almacenamientoAgua,
  provisionAgua,
  servicioAgua,
} from "../config/relevamientoAgua";

interface ServicioBasicoData {
  tipo_provision: string;
  tipo_provision_estado: string;
  tipo_almacenamiento: string;
  tipo_almacenamiento_estado: string;
  alcance: string[];
}

interface ServicioBasicoProps {
  onChange: (data: ServicioBasicoData) => void;
}

export default function ServicioBasicoComponent({
  onChange,
}: ServicioBasicoProps) {
  const [data, setData] = useState<ServicioBasicoData>({
    tipo_provision: "",
    tipo_provision_estado: "",
    tipo_almacenamiento: "",
    tipo_almacenamiento_estado: "",
    alcance: [],
  });
  const [alcanceSeleccionado, setAlcanceSeleccionado] = useState<string>("");

  const getQuestionById = useCallback(
    (id: string, options: { id: string; question: string }[]): string => {
      return options.find((opt) => opt.id === id)?.question || "";
    },
    []
  );

  // Dependencia añadida a `useCallback` para que siempre use la última versión de `processQuestions`
  const processQuestions = useCallback(
    (data: ServicioBasicoData) => {
      console.log("Alcance original:", data.alcance); // Verifica los IDs originales
      return {
        tipo_provision: getQuestionById(data.tipo_provision, servicioAgua),
        tipo_provision_estado: data.tipo_provision_estado,
        tipo_almacenamiento: getQuestionById(
          data.tipo_almacenamiento,
          almacenamientoAgua
        ),
        tipo_almacenamiento_estado: data.tipo_almacenamiento_estado,
        alcance: data.alcance.map((id) => {
          const question = getQuestionById(id, provisionAgua);
          console.log(`ID: ${id} -> Pregunta: ${question}`); // Verifica cada transformación
          return question;
        }),
      };
    },
    [getQuestionById]
  );

  const handleAlcanceChange = (newAlcance: string[]) => {
    const updatedData = { ...data, alcance: newAlcance };
    setData(updatedData);

    const transformed = processQuestions(updatedData);
    onChange(transformed);
  };

  const handleChange = useCallback(
    (field: keyof ServicioBasicoData, value: string) => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);

      // Solo pasa los datos procesados al padre
      const transformed = processQuestions(updatedData);
      onChange(transformed);
    },
    [data, onChange, processQuestions] // Incluimos `processQuestions` en las dependencias
  );

  const handleAddAlcance = () => {
    if (alcanceSeleccionado && !data.alcance.includes(alcanceSeleccionado)) {
      const updatedAlcance = [...data.alcance, alcanceSeleccionado];
      handleAlcanceChange(updatedAlcance); // ✅ ahora sí se procesa correctamente
    }
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
          <p>3</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">AGUA</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
          <p>3.1</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">TIPO DE PROVISIÓN DE AGUA</p>
        </div>
      </div>
      <div className="w-full mt-2 text-xs flex gap-4">
        <div className="w-1/2">
          <Select
            label=""
            value={data.tipo_provision}
            onChange={(e) => handleChange("tipo_provision", e.target.value)}
            options={servicioAgua.map((opt) => ({
              value: opt.id,
              label: opt.question,
            }))}
          />
        </div>
        {data.tipo_provision &&
          servicioAgua.some(
            (opt) => opt.id === data.tipo_provision && opt.showCondition
          ) && (
            <div className="w-1/2">
              <Select
                label=""
                value={data.tipo_provision_estado}
                onChange={(e) =>
                  handleChange("tipo_provision_estado", e.target.value)
                }
                options={[
                  { value: "Regular", label: "Regular" },
                  { value: "Bueno", label: "Bueno" },
                  { value: "Malo", label: "Malo" },
                ]}
              />
            </div>
          )}
      </div>
      <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
          <p>3.2</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">TIPO DE ALMACENAMIENTO</p>
        </div>
      </div>
      <div className="w-full mt-2 text-xs flex gap-4">
        <div className="w-1/2">
          <Select
            label=""
            value={data.tipo_almacenamiento}
            onChange={(e) =>
              handleChange("tipo_almacenamiento", e.target.value)
            }
            options={almacenamientoAgua.map((opt) => ({
              value: opt.id,
              label: opt.question,
            }))}
          />
        </div>
        {data.tipo_almacenamiento &&
          almacenamientoAgua.some(
            (opt) => opt.id === data.tipo_almacenamiento && opt.showCondition
          ) && (
            <div className="w-1/2">
              <Select
                label=""
                value={data.tipo_almacenamiento_estado}
                onChange={(e) =>
                  handleChange("tipo_almacenamiento_estado", e.target.value)
                }
                options={[
                  { value: "Regular", label: "Regular" },
                  { value: "Bueno", label: "Bueno" },
                  { value: "Malo", label: "Malo" },
                ]}
              />
            </div>
          )}
      </div>
      <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
          <p>3.3</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">
            ALCANCE DE LA PROVISIÓN DE AGUA
          </p>
        </div>
      </div>
      <div className="w-full flex mt-2 text-xs gap-4">
        <div className="w-1/2">
          <Select
            label=""
            value={alcanceSeleccionado}
            onChange={(e) => setAlcanceSeleccionado(e.target.value)}
            options={provisionAgua.map((opt) => ({
              value: opt.id,
              label: opt.question,
            }))}
          />
        </div>
        <div className="w-1/2">
          <table className="min-w-full text-sm table-auto border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-center">Alcance</th>
                <th className="p-2 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {data.alcance.map((alc, i) => {
                const label =
                  provisionAgua.find((opt) => opt.id === alc)?.question || alc;
                return (
                  <tr key={i} className="border-b hover:bg-slate-100">
                    <td className="p-2">{label}</td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const updatedAlcance = data.alcance.filter(
                            (a) => a !== alc
                          );
                          handleAlcanceChange(updatedAlcance);
                        }}
                        className="text-red-500 text-sm"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleAddAlcance}
          className="font-bold p-2 text-sm bg-custom hover:bg-custom/50 text-white rounded-lg"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
