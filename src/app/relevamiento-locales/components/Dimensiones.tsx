"use client";

import NumericInput from "@/components/ui/NumericInput";
import { Dimension } from "@/interfaces/DimensionLocales";
import { useState } from "react";

export default function Dimensiones() {
  const [dimensiones, setDimensiones] = useState<Dimension[]>([
    {
      id: 0,
      largo: 0,
      ancho: 0,
      diametro: 0,
      alturaMaxima: 0,
      alturaMinima: 0,
    },
  ]);

  const handleInputChange = (
    id: number,
    field: keyof Omit<Dimension, "id">,
    value: number
  ) => {
    setDimensiones((prevDimensiones) =>
      prevDimensiones.map((dimension) =>
        dimension.id === id ? { ...dimension, [field]: value } : dimension
      )
    );
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
                <NumericInput
                  label=""
                  subLabel="m"
                  value={dimension.largo}
                  onChange={(value) =>
                    handleInputChange(dimension.id, "largo", Number(value))
                  }
                  disabled={false}
                />
              </td>
              <td className="border p-2">
                <NumericInput
                  label=""
                  subLabel="m"
                  value={dimension.ancho}
                  onChange={(value) =>
                    handleInputChange(dimension.id, "ancho", Number(value))
                  }
                  disabled={false}
                />
              </td>
              <td className="border p-2">
                <NumericInput
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
                <NumericInput
                  label=""
                  subLabel="m"
                  value={dimension.alturaMaxima}
                  onChange={(value) =>
                    handleInputChange(dimension.id, "alturaMaxima", Number(value))
                  }
                  disabled={false}
                />
              </td>
              <td className="border p-2">
                <NumericInput
                  label=""
                  subLabel="m"
                  value={dimension.alturaMinima}
                  onChange={(value) =>
                    handleInputChange(dimension.id, "alturaMinima", Number(value))
                  }
                  disabled={false}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
