import {
  Column,
  FactoresRiesgoAmbiental,
} from "@/interfaces/FactoresRiesgoAmbienta";
import { useAppSelector } from "@/redux/hooks";
import { setFactores } from "@/redux/slices/serviciosFactoresSlice";
import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface FactoresRiesgoFormProps {
  serviciosData: FactoresRiesgoAmbiental[];
  columnsConfig: Column[];
}

const FactoresRiesgoTable: React.FC<FactoresRiesgoFormProps> = ({
  serviciosData,
  columnsConfig,
}) => {
  const [servicios, setServicios] = useState<FactoresRiesgoAmbiental[]>(serviciosData);
  const dispatch = useDispatch();

  const relevamientoId = useAppSelector(
        (state) => state.espacio_escolar.relevamientoId
      );

  const handleChange = (
    index: number,
    field: keyof FactoresRiesgoAmbiental,
    value: string
  ) => {
    const updatedServicios = [...servicios];
    updatedServicios[index] = { ...updatedServicios[index], [field]: value };;
    setServicios(updatedServicios);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        // Agregamos relevamiento_id a cada servicio
        const serviciosConRelevamiento = servicios.map((servicio) => ({
          ...servicio,
          relevamiento_id: relevamientoId,
        }));
      
        // Enviar el array directamente en lugar de un objeto que lo envuelve
        const response = await fetch("/api/servicios_factores_riesgo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviciosConRelevamiento), // Envía el array directamente
        });
      
        if (response.ok) {
          dispatch(setFactores(serviciosConRelevamiento)); // Guardamos los datos en Redux
          toast("✅ Servicios cargados correctamente!");
        } else {
          toast("❌ Error al cargar los servicios.");
        }
      };

  return (
    <div className="p-4 mx-10">
      <form onSubmit={handleSubmit}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              {columnsConfig.map((column) => (
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
            {servicios.map((servicio, index) => (
              <tr key={servicio.id_servicio}>
                {columnsConfig.map((column) => (
                  <td key={`${servicio.id}-${column.key}`} className="border p-2">
                    {column.type === "select" && (
                      <select
                        value={servicio[column.key]}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          handleChange(index, column.key, e.target.value)
                        }
                        className="w-full p-2 border rounded"
                        disabled={column.conditional && !column.conditional(servicio)}
                      >
                        <option value="">Seleccionar</option>
                        {column.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                    {column.type === "input" && (
                      <input
                        type="text"
                        value={servicio[column.key]}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange(index, column.key, e.target.value)
                        }
                        className="w-full p-2 border rounded"
                        disabled={column.conditional && !column.conditional(servicio)}
                      />
                    )}
                    {column.type === "text" && <div>{servicio[column.key]}</div>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="text-sm font-bold bg-slate-200 p-4 rounded-md flex-nowrap"
          >
            Cargar información
          </button>
        </div>
      </form>
    </div>
  );
};

export default FactoresRiesgoTable;
