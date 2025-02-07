"use client";
import AlphanumericInput from "@/components/ui/AlphanumericInput";
import { useState } from "react";

interface CuiComponentProps {
  label: string;
}

const CuiComponent: React.FC<CuiComponentProps> = ({ label }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="mx-10">
      <p className="text-sm">{label}</p>
      <div className="flex mt-2 p-2 border items-center">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>A</p>
        </div>
        <div>
          <p className="text-sm font-bold justify-center ml-4">
            CUI (Código Único de Infraestructura)
          </p>
        </div>
        <div className="ml-auto">
          <AlphanumericInput
            subLabel=""
            label={""}
            value={inputValue}
            onChange={(newValue) => setInputValue(newValue)}
          />
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-sm text-gray-400">
          Transcriba de la hoja de ruta el Número de CUI
        </p>
      </div>
    </div>
  );
}

export default CuiComponent;
