import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { toast } from "react-toastify";

interface Plantas {
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

interface CantidadPlantasProps {
  construccionId: number | null;
}

export default function CantidadPlantas({
  construccionId,
}: CantidadPlantasProps) {
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );

  const [plantas, setPlantas] = useState<Plantas>({
    subsuelo: undefined,
    pb: undefined,
    pisos_superiores: undefined,
    total_plantas: undefined,
  });

  const calcularTotal = (datos: Plantas) =>
    (datos.subsuelo || 0) + (datos.pb || 0) + (datos.pisos_superiores || 0);

  const handleUpdateField = (field: keyof Plantas, value: number) => {
    // Permitir que el campo quede vacío para edición
    if (!isNaN(value) && value < 0) {
      toast.warning("No se permiten valores negativos");
      return;
    }

    setPlantas((prev) => {
      const nuevoEstado = {
        ...prev,
        [field]: isNaN(value) ? undefined : value,
      };
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
        toast.warning("Por favor, complete todos los campos.");
        return;
      }

      const response = await fetch("/api/plantas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          relevamiento_id: relevamientoId,
          construccion_id: construccionId,
          plantas,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      toast.success("Datos guardados correctamente");

      setPlantas({
        subsuelo: undefined,
        pb: undefined,
        pisos_superiores: undefined,
        total_plantas: undefined,
      });
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      toast.error("Hubo un error al guardar los datos.");
    }
  };

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      {/* encabezado */}
      <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
          <p>1</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">CANTIDAD DE PLANTAS</p>
        </div>
        <div className="flex items-center p-1 border bg-gray-100 text-gray-400 text-xs">
          <p>
            Ingrese la cantidad de pisos de la construcción. El nivel de acceso
            se considerará como PLANTA BAJA.
          </p>
        </div>
      </div>

      {/* tabla */}
      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px] text-sm text-center">
          <thead>
            <tr className="bg-custom text-white">
              {columnas.map((column) => (
                <th key={column.key} className="border p-2 text-center">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {columnas.map((column) => (
                <td key={column.key} className="border p-2 text-center">
                  {column.key !== "total_plantas" ? (
                    <input
                      type="number"
                      value={plantas[column.key] ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleUpdateField(
                          column.key,
                          val === "" ? NaN : Number(val)
                        );
                      }}
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

      {/* botón */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleGuardarCambios}
          className="text-sm text-white font-bold bg-custom hover:bg-custom/50 p-2 rounded-lg flex-nowrap"
        >
          Guardar Información
        </button>
      </div>
    </div>
  );
}
