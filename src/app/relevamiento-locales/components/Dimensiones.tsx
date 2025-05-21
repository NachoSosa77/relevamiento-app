"use client";

import DecimalNumericInput from "@/components/ui/DecimalNumericInput";
import { Dimension } from "@/interfaces/DimensionLocales";
import { localesService } from "@/services/localesServices";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type DimensionesProps = {
  onUpdate?: () => void; // Esta función se llama cuando hay cambios
};

export default function Dimensiones({ onUpdate }: DimensionesProps) {
  const params = useParams();
  const id = Number(params.id);
  const [dimensiones, setDimensiones] = useState<Dimension[]>([
    {
      id: Number(id),
      largo_predominante: 0,
      ancho_predominante: 0,
      diametro: 0,
      altura_maxima: 0,
      altura_minima: 0,
    },
  ]);

  const handleInputChange = (
    id: number,
    field: keyof Omit<Dimension, "id">,
    value: number
  ) => {
    setDimensiones((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleGuardar = async () => {
  const dimension = dimensiones[0];

  // Validación mínima: verificar si al menos un campo tiene un valor
  const hayDatos = Object.values(dimension).some(
    (valor) =>
      valor !== null &&
      valor !== "" &&
      !(typeof valor === "number" && valor === 0)
  );

  if (!hayDatos) {
    toast.warning("Por favor, completá al menos un dato antes de guardar.");
    return;
  }

  try {
    const result = await localesService.updateDimensionesById(id, dimension);
    console.log("Resultado:", result);
    toast.success("Dimensiones actualizadas correctamente.");
    if (onUpdate) onUpdate(); // Notifica al padre que hubo cambio
  } catch (error) {
    console.error("Error al guardar dimensiones:", error);
    toast.error("Ocurrió un error al guardar.");
  }
};

  return (
    <div className="mx-10 text-sm">
      <table className="w-full border mt-2 text-xs">
        <thead>
          <tr className="bg-slate-200">
            <th className="border p-2 bg-black text-white">2</th>
            <th className="border p-2">DIMENSIONES</th>
            <th className="border p-2">Largo predominante (en m.)</th>
            <th className="border p-2">Ancho predominante (en m.)</th>
            <th className="border p-2">Diámetro (en m.)</th>
            <th className="border p-2">Altura máxima (en m.)</th>
            <th className="border p-2">altura mínima (en m.)</th>
          </tr>
        </thead>
        <tbody>
          {dimensiones.map((dimension) => (
            <tr className="border" key={dimension.id}>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2">
                <DecimalNumericInput
                  label=""
                  subLabel="m"
                  value={dimension.largo_predominante}
                  onChange={(value) =>
                    handleInputChange(
                      dimension.id,
                      "largo_predominante",
                      Number(value)
                    )
                  }
                  disabled={false}
                />
              </td>
              <td className="border p-2">
                <DecimalNumericInput
                  label=""
                  subLabel="m"
                  value={dimension.ancho_predominante}
                  onChange={(value) =>
                    handleInputChange(
                      dimension.id,
                      "ancho_predominante",
                      Number(value)
                    )
                  }
                  disabled={false}
                />
              </td>
              <td className="border p-2">
                <DecimalNumericInput
                  label=""
                  subLabel="m"
                  value={dimension.diametro}
                  onChange={(value) =>
                    handleInputChange(dimension.id, "diametro", Number(value))
                  }
                  disabled={false}
                />
              </td>
              <td className="border p-2">
                <DecimalNumericInput
                  label=""
                  subLabel="m"
                  value={dimension.altura_maxima}
                  onChange={(value) =>
                    handleInputChange(
                      dimension.id,
                      "altura_maxima",
                      Number(value)
                    )
                  }
                  disabled={false}
                />
              </td>
              <td className="border p-2">
                <DecimalNumericInput
                  label=""
                  subLabel="m"
                  value={dimension.altura_minima}
                  onChange={(value) =>
                    handleInputChange(
                      dimension.id,
                      "altura_minima",
                      Number(value)
                    )
                  }
                  disabled={false}
                />
              </td>
              <td>
                <div className="flex justify-center items-center h-full">

                  <button
                    onClick={handleGuardar}
                    className="bg-slate-200 text-sm font-bold px-4 py-2 rounded-md"
                  >
                    Guardar Información
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
