import { Column, ServiciosBasicos } from "@/interfaces/ServiciosBasicos";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setServicios } from "@/redux/slices/serviciosSlice";
import React, { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

interface ServiciosBasicosFormProps {
  serviciosData: ServiciosBasicos[];
  columnsConfig: Column[];
}

const ServiciosBasicosForm: React.FC<ServiciosBasicosFormProps> = ({
  serviciosData,
  columnsConfig,
}) => {
  const dispatch = useAppDispatch();
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );

  //console.log("relevamientoId", relevamientoId);
  const [servicios, setServiciosLocal] =
    useState<ServiciosBasicos[]>(serviciosData);

  // Función para manejar los cambios en los inputs/selects
  const handleChange = (
    index: number,
    field: keyof ServiciosBasicos,
    value: string
  ) => {
    const updatedServicios = [...servicios];
    updatedServicios[index] = { ...updatedServicios[index], [field]: value };
    setServiciosLocal(updatedServicios); // Actualizamos el estado local con los nuevos valores
  };

  // Función para manejar el envío del formulario
  // ...

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación antes de enviar
    const esFormularioValido = servicios.every((servicio) =>
      columnsConfig.every((column) => {
        if (column.type === "text") return true; // no se valida texto estático
        const valor = servicio[column.key];
        return valor !== undefined && valor !== null && valor !== "";
      })
    );

    if (!esFormularioValido) {
      toast.warning("Por favor, completá todos los campos antes de enviar.");
      return;
    }

    // Agregamos relevamiento_id a cada servicio
    const serviciosConRelevamiento = servicios.map((servicio) => ({
      ...servicio,
      relevamiento_id: relevamientoId,
    }));

    try {
      const response = await fetch("/api/servicios_basicos_predio", {
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
      toast.error("Error inesperado al enviar los datos.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 mx-10">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-center">
            {columnsConfig.map((column) => (
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
          {servicios.map((servicio, index) => (
            <tr key={servicio.id_servicio}>
              {columnsConfig.map((column) => (
                <td
                  key={`${servicio.id_servicio}-${column.key}`}
                  className="border p-2 text-center"
                >
                  {column.type === "select" && (
                    <select
                      value={servicio[column.key] as string} // Asegúrate de que el valor esté vinculado correctamente
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        handleChange(index, column.key, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={
                        column.conditional && !column.conditional(servicio)
                      }
                    >
                      <option value="">Seleccionar</option>
                      {Array.isArray(column.options)
                        ? column.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))
                        : column.options?.(servicio).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                    </select>
                  )}
                  {column.type === "input" && (
                    <input
                      type="text"
                      value={servicio[column.key] as string} // Asegúrate de que el valor esté vinculado correctamente
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, column.key, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={
                        column.conditional && !column.conditional(servicio)
                      }
                    />
                  )}
                  {column.type === "text" && (
                    <div>{servicio[column.key] as string}</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="text-sm font-bold bg-slate-200 p-4 rounded-md"
        >
          Cargar Información
        </button>
      </div>
    </form>
  );
};

export default ServiciosBasicosForm;
