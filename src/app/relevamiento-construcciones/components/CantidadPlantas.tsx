import { useAppSelector } from "@/redux/hooks";
import {
  addConstruccion,
  setConstruccionTemporal,
} from "@/redux/slices/construccionesSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

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
  const dispatch = useDispatch();
  const construccionTemporal = useAppSelector(
    (state) => state.construcciones.construccionTemporal
  );

  // Iniciar el estado de plantas con los valores de construccionTemporal
  const [plantas, setPlantas] = useState<Plantas>({
    subsuelo: construccionTemporal?.plantas?.subsuelo ?? undefined,
    pb: construccionTemporal?.plantas?.pb ?? undefined,
    pisos_superiores: construccionTemporal?.plantas?.pisos_superiores ?? undefined,
    total_plantas: construccionTemporal?.plantas?.total_plantas ?? undefined,
  });

  // Calcular el total de plantas
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
        toast.error("Por favor, complete todos los campos.");
        return;
      }

      toast.success("Datos guardados correctamente");

      // Limpiar el estado local de plantas después de guardar
      setPlantas({
        subsuelo: undefined,
        pb: undefined,
        pisos_superiores: undefined,
        total_plantas: undefined,
      });

      // Actualizar los datos en Redux
      if (construccionTemporal) {
        const nuevaConstruccion = {
          ...construccionTemporal,
          plantas,
        };

        dispatch(addConstruccion(nuevaConstruccion));
        dispatch(setConstruccionTemporal(nuevaConstruccion));

        console.log("Construcción actualizada con plantas:", nuevaConstruccion);
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      toast.error("Hubo un error al guardar los datos.");
    }
  };

  // Usar useEffect para actualizar el estado si construccionTemporal cambia
  useEffect(() => {
    if (construccionTemporal?.plantas) {
      setPlantas({
        subsuelo: construccionTemporal.plantas.subsuelo,
        pb: construccionTemporal.plantas.pb,
        pisos_superiores: construccionTemporal.plantas.pisos_superiores,
        total_plantas: construccionTemporal.plantas.total_plantas,
      });
    }
  }, [construccionTemporal]);

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
            se considerará como PLANTA BAJA.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px] text-sm text-center">
          <thead>
            <tr className="bg-gray-200">
              {columnas.map((column) => (
                <th
                  key={column.key}
                  className={`border p-2 text-center ${
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
                <td key={column.key} className="border p-2 text-center">
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
