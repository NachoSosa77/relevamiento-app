"use client";

import axios from "axios";
import { useState } from "react";

interface Plantas {
  id?: number;
  subsuelo?: number;
  pb?: number;
  pisos_superiores?: number;
  total_plantas?: number;
}

interface Column {
  header: string;
  key: keyof Plantas;
  type: "number";
}

const columnas: Column[] = [
  { header: "Subsuelos", key: "subsuelo", type: "number" },
  { header: "PB", key: "pb", type: "number" },
  { header: "Pisos Superiores", key: "pisos_superiores", type: "number" },
  { header: "Total de Plantas", key: "total_plantas", type: "number" },
];

export default function CantidadPlantas() {
  const [plantas, setPlantas] = useState<Plantas>({
    subsuelo: undefined,
    pb: undefined,
    pisos_superiores: undefined,
    total_plantas: undefined,
  });

  const calcularTotal = (datos: Plantas) => {
    return (
      (datos.subsuelo || 0) + (datos.pb || 0) + (datos.pisos_superiores || 0)
    );
  };

  const handleUpdateField = (field: keyof Plantas, value: number) => {
    setPlantas((prev) => {
      const nuevoEstado = { ...prev, [field]: value };
      return { ...nuevoEstado, total_plantas: calcularTotal(nuevoEstado) };
    });
  };

  const handleGuardarCambios = async () => {
    try {
      if (
        plantas.subsuelo === undefined ||
        plantas.pb === undefined ||
        plantas.pisos_superiores === undefined
      ) {
        alert("Por favor, complete todos los campos.");
        return;
      }
      await axios.post("/api/cantidad_plantas", plantas);
      alert("Datos guardados correctamente");
      setPlantas({
        subsuelo: undefined,
        pb: undefined,
        pisos_superiores: undefined,
        total_plantas: undefined,
      });
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Hubo un error al guardar los datos.");
    }
  };

  return (
    <div className="mx-10">
      <div className="flex items-center gap-2 mt-2 p-2 border">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>1</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">CANTIDAD DE PLANTAS</p>
        </div>
        <div className="flex items-center p-1 border bg-slate-200 text-slate-400 text-xs">
          <p>
            Ingrese la cantidad de pisos de la construcción. El nivel de acceso
            se considerará como PLANTA BAJA
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px] text-sm">
          <thead>
            <tr className="bg-gray-200">
              {columnas.map((column) => (
                <th
                  key={column.key}
                  className={`border p-2 text-left ${
                    column.key === "id" ? "bg-black text-white" : ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {columnas.map((column) => (
                <td key={column.key} className="border p-2">
                  {column.key !== "total_plantas" ? (
                    <input
                      type="number"
                      value={plantas[column.key] ?? ""}
                      onChange={(e) =>
                        handleUpdateField(column.key, Number(e.target.value))
                      }
                      className="border p-2 rounded-lg"
                    />
                  ) : (
                    <span>{plantas.total_plantas ?? 0}</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleGuardarCambios}
          className="text-sm font-bold bg-slate-200 p-4 rounded-md flex-nowrap"
        >
          Guardar Información
        </button>
      </div>
    </div>
  );
}
