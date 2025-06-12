import ConfirmModal from "@/components/ui/ConfirmModal";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
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
  const relevamientoId = useRelevamientoId();

  const [plantas, setPlantas] = useState<Plantas>({
    subsuelo: undefined,
    pb: undefined,
    pisos_superiores: undefined,
    total_plantas: undefined,
  });
  const [plantaIdExistente, setPlantaIdExistente] = useState<number | null>(
    null
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(
    () => {}
  );
  const calcularTotal = (datos: Plantas) =>
    Math.abs(datos.subsuelo || 0) +
    Math.abs(datos.pb || 0) +
    Math.abs(datos.pisos_superiores || 0);

  const handleUpdateField = (field: keyof Plantas, value: number) => {
    // Permitir que el campo quede vacío para edición
    if (!isNaN(value)) {
      if (field !== "subsuelo" && value < 0) {
        toast.warning("No se permiten valores negativos en este campo");
        return;
      }
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

      const data = await response.json();

      if (data.exists && data.planta_id) {
        setPlantaIdExistente(data.planta_id);

        // Guardamos el callback en línea
        setOnConfirmCallback(() => async () => {
          try {
            const plantasActualizadas = {
              ...plantas,
              total_plantas:
                Math.abs(plantas.subsuelo ?? 0) +
                (plantas.pb ?? 0) +
                (plantas.pisos_superiores ?? 0),
            };
            const patchRes = await fetch("/api/plantas", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                planta_id: data.planta_id,
                plantas: plantasActualizadas,
              }),
            });

            if (!patchRes.ok) throw new Error("Error al actualizar los datos");

            toast.success("Datos actualizados correctamente");

            // Limpiamos el estado
            setPlantas({
              subsuelo: undefined,
              pb: undefined,
              pisos_superiores: undefined,
              total_plantas: undefined,
            });
          } catch (error) {
            toast.error("Hubo un error al actualizar los datos.");
            console.error(error);
          }
        });

        setShowConfirm(true); // Mostramos el modal
      } else {
        toast.success("Datos guardados correctamente");

        setPlantas({
          subsuelo: undefined,
          pb: undefined,
          pisos_superiores: undefined,
          total_plantas: undefined,
        });
      }
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
          {plantaIdExistente ? "Actualizar Información" : "Guardar Información"}
        </button>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={onConfirmCallback}
        message="Ya existen datos de plantas para esta construcción. ¿Desea actualizarlos?"
      />
    </div>
  );
}
