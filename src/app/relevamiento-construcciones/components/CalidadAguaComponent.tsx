/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import NumericInput from "@/components/ui/NumericInput";
import Select from "@/components/ui/SelectComponent";
import { useState } from "react";
import { calidadPropAgua } from "../config/relevamientoAgua";
import { tipoTratamientoOpciones } from "../config/tipoTratamiento";

interface Servicio {
  id: string;
  question: string;
  showCondition: boolean;
}

interface CalidadAguaProps {
  servicios: Servicio[];
  onChange: (data: {
    tratamiento: string;
    tipo_tratamiento: string;
    constrol_sanitario: string;
    cantidad_veces: string;
  }) => void;
}

export default function CalidadAguaComponent({
  servicios,
  onChange,
}: CalidadAguaProps) {
  const [formData, setFormData] = useState({
    tratamiento: "",
    tipo_tratamiento: "",
    constrol_sanitario: "",
    cantidad_veces: "",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    const updated = { ...formData, [field]: value };

    // Reset campos dependientes si cambian sus condiciones
    if (field === "tratamiento" && value !== "Si") {
      updated.tipo_tratamiento = "";
    }
    if (field === "constrol_sanitario" && value !== "Si") {
      updated.cantidad_veces = "";
    }

    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mt-2 p-2 border bg-slate-200">
        <div className="w-6 h-6 flex justify-center text-black font-bold">
          <p>3.1</p>
        </div>
        <div className="h-6 flex items-center justify-center bg-slate-200">
          <p className="px-2 text-sm font-bold">
            CALIDAD DE AGUA PARA CONSUMO HUMANO
          </p>
        </div>
      </div>

      {/* Tratamiento del agua */}
      <div className="w-full mt-2 text-xs flex gap-4">
        <div className="w-1/2">
          <Select
            label=""
            value={formData.tratamiento}
            onChange={(e) => handleChange("tratamiento", e.target.value)}
            options={calidadPropAgua.map((opt) => ({
              value: opt.id,
              label: opt.question,
            }))}
          />
        </div>
        {/* Tipo de tratamiento */}
        {formData.tratamiento &&
    (() => {
      const selectedOption = calidadPropAgua.find(
        (opt) => opt.id === formData.tratamiento
      );
      if (!selectedOption) return null;

      return selectedOption.showCondition ? (
        <div className="w-1/2 justify-center items-center">
          <Select
            label=""
            value={formData.tipo_tratamiento}
            onChange={(e) => handleChange("tipo_tratamiento", e.target.value)}
            options={tipoTratamientoOpciones.map((opt) => ({
              value: opt.id,
              label: opt.name,
            }))}
          />
        </div>
      ) : (
        <div className="w-1/2 justify-center items-center flex">
          <p className="font-bold mx-4">Cantidad de veces al año</p>
          <NumericInput
            label=""
            subLabel=""
            value={
              formData.cantidad_veces !== ""
                ? parseInt(formData.cantidad_veces)
                : undefined
            }
            onChange={(val) =>
              handleChange("cantidad_veces", val !== undefined ? val.toString() : "")
            }
            disabled={false}
          />
        </div>
      );
    })()}
      </div>
    </div>
  );
}
