"use client";

import Select from "@/components/ui/SelectComponent";
import { useState } from "react";
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


  const handleChange = (field: keyof ServicioBasicoData, value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onChange(updatedData);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>3</p>
        </div>
        <div className="h-6 flex items-center justify-center bg-slate-200">
          <p className="px-2 text-sm font-bold">AGUA</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <div className="w-6 h-6 flex justify-center text-black font-bold">
          <p>3.1</p>
        </div>
        <div className="h-6 flex items-center justify-center bg-slate-200">
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
        {
          // Muestra el TextInput solo si el servicio seleccionado tiene showCondition: true
          data.tipo_provision &&
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
          )
        }
      </div>
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <div className="w-6 h-6 flex justify-center text-black font-bold">
          <p>3.2</p>
        </div>
        <div className="h-6 flex items-center justify-center bg-slate-200">
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
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <div className="w-6 h-6 flex justify-center text-black font-bold">
          <p>3.3</p>
        </div>
        <div className="h-6 flex items-center justify-center bg-slate-200">
          <p className="px-2 text-sm font-bold">
            ALCANCE DE LA PROVICIÓN DE AGUA
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
                <th className="p-2 text-center bg-slate-200">Alcance</th>
                <th className="p-2 text-center bg-slate-200">Acción</th>
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
                        onClick={() =>
                          setData((prev) => ({
                            ...prev,
                            alcance: prev.alcance.filter((a) => a !== alc),
                          }))
                        }
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
          onClick={() => {
            if (
              alcanceSeleccionado &&
              !data.alcance.includes(alcanceSeleccionado)
            ) {
              setData((prev) => {
                const updated = { ...prev, alcance: [...prev.alcance, alcanceSeleccionado] };
                onChange(updated);
                return updated;
              });
              setAlcanceSeleccionado("");
            }
          }}
          className="ml-2 px-2 py-1 text-sm bg-blue-500 text-white rounded"
        >
          Agregar
        </button>
      </div>
      <div className="mt-2">

      </div>

    </div>
  );
}
