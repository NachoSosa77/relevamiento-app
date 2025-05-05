"use client";

import DecimalNumericInput from "@/components/ui/DecimalNumericInput";
import { Dimension } from "@/interfaces/DimensionLocales";
import { localesService } from "@/services/localesServices";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Dimensiones() {
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

  try {
    //console.log("Enviando:", dimension);
    const result = await localesService.updateDimensionesById(id, dimension);
    console.log("Resultado:", result);
    toast("Dimensiones actualizadas correctamente.");
  } catch (error) {
    console.error("Error al guardar dimensiones:", error);
    toast("Ocurrió un error al guardar.");
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
              <td className="border p-2">{dimension.id}</td>
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
                  <button
                    onClick={handleGuardar}
                    className="bg-slate-200 text-sm font-bold px-4 py-2 rounded-md"
                  >
                    Guardar Información
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
