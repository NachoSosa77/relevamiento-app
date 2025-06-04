import {
  Column,
  ServiciosTransporteComunicaciones,
} from "@/interfaces/ServiciosTransporteComunicaciones";
import { useAppSelector } from "@/redux/hooks";
import { setServicios } from "@/redux/slices/serviciosTransporteSlice";
import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface ServiciosTransporteFormProps {
  serviciosData: ServiciosTransporteComunicaciones[];
  columnsConfig: Column[];
}

const ServiciosTransporteForm: React.FC<ServiciosTransporteFormProps> = ({
  serviciosData,
  columnsConfig,
}) => {
  const dispatch = useDispatch();
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );

  const [servicios, setServiciosLocal] =
    useState<ServiciosTransporteComunicaciones[]>(serviciosData);

  const handleChange = (
    index: number,
    field: keyof ServiciosTransporteComunicaciones,
    value: string
  ) => {
    const updatedServicios = [...servicios];
    updatedServicios[index] = { ...updatedServicios[index], [field]: value };
    setServiciosLocal(updatedServicios); // Actualizamos el estado local con los nuevos valores
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Validar si al menos un campo (que no sea de tipo texto) fue modificado
  const alMenosUnServicioValido = servicios.some((servicio) =>
    columnsConfig.some((column) => {
      if (column.type === "text") return false; // ignorar columnas visuales
      const valor = servicio[column.key];
      return valor !== undefined && valor !== null && valor !== "";
    })
  );

  if (!alMenosUnServicioValido) {
    toast.warning("Por favor, completá al menos un campo antes de enviar.");
    return;
  }

  const serviciosConRelevamiento = servicios.map((servicio) => ({
    ...servicio,
    relevamiento_id: relevamientoId,
  }));

  try {
    const response = await fetch("/api/servicios_transporte_comunicaciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviciosConRelevamiento),
    });

    if (response.ok) {
      dispatch(setServicios(serviciosConRelevamiento));
      toast.success("Servicios cargados correctamente!");
    } else {
      toast.error("Error al cargar los servicios.");
    }
  } catch (error) {
    toast.error("Error de red o del servidor.");
    console.error(error);
  }
};


  return (
    <form onSubmit={handleSubmit} className="p-2 mx-10 mt-4 bg-white rounded-lg border shadow-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-custom text-white text-center">
            {columnsConfig.map((column) => (
              <th
                key={column.key}
                className={`border p-2 text-center ${
                  column.key === "id_servicio" ? "bg-custom/50 text-white" : ""
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
                <td
                  key={`${servicio.id_servicio}-${column.key}`}
                  className="border p-2 text-center"
                >
                  {column.type === "select" && (
                    <select
                      value={servicio[column.key]}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        handleChange(index, column.key, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={
                        column.conditional && !column.conditional(servicio)
                      }
                    >
                      <option value="">Seleccionar</option>
                      {typeof column.options === "function"
                        ? column.options(servicio)?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))
                        : column.options?.map((option) => (
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
                      disabled={
                        column.conditional && !column.conditional(servicio)
                      }
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
          className="text-sm font-bold bg-custom hover:bg-custom/50 text-white p-2 rounded-lg"
        >
          Cargar Información
        </button>
      </div>
    </form>
  );
};

export default ServiciosTransporteForm;
