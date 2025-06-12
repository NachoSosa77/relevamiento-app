/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { AreasExteriores, Column } from "@/interfaces/AreaExterior";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { areasExterioresColumns } from "../config/areaExterior";

interface Opcion {
  id: number;
  label: string;
}

const AreasExterioresTable: React.FC = () => {
  const relevamientoId = useRelevamientoId();
  const [columnsConfig, setColumnsConfig] = useState<Column[]>([]);
  const [servicios, setServicios] = useState<AreasExteriores[]>([]);
  const [tipoOpciones, setTipoOpciones] = useState<Opcion[]>([]);
  const [terminacionPisoOpciones, setTerminacionPisoOpciones] = useState<
    string[]
  >([]);
  const estadoConservacionOpciones = ["Bueno", "Malo", "Regular"]; // Opciones fijas

  // 🚀 Cargar columnas configuradas
  useEffect(() => {
    const fetchColumns = async () => {
      const columns = await areasExterioresColumns();
      setColumnsConfig(columns);
    };
    fetchColumns();
  }, []);

  // 🚀 Cargar opciones de tipo de área
  useEffect(() => {
    const fetchOpcionesTipoArea = async () => {
      try {
        const response = await axios.get("/api/areas_exteriores/opciones");
        const opcionesFormateadas = response.data.map(
          (opcion: { id: number; name: string; prefijo: string }) => ({
            id: opcion.id,
            label: `${opcion.prefijo} - ${opcion.name}`,
          })
        );
        setTipoOpciones(opcionesFormateadas);
      } catch (error) {
        console.error("Error al obtener opciones de tipo de área:", error);
      }
    };

    fetchOpcionesTipoArea();
  }, []);

  // 🚀 Cargar opciones de terminación del piso (vienen como array de strings)
  useEffect(() => {
    const fetchOpcionesTerminacionPiso = async () => {
      try {
        const response = await axios.get("/api/terminacion_piso/opciones");
        setTerminacionPisoOpciones(response.data); // Almacenar directamente el array de strings
      } catch (error) {
        console.error(
          "Error al obtener opciones de terminación del piso:",
          error
        );
      }
    };

    fetchOpcionesTerminacionPiso();
  }, []);

  // 🚀 Cargar datos de áreas exteriores asociadas al relevamientoId
  useEffect(() => {
    const fetchAreasExteriores = async () => {
      if (relevamientoId) {
        try {
          const response = await axios.get(`/api/areas_exteriores/by_relevamiento/${relevamientoId}`);
          
          setServicios(response.data.areasExteriores);
        } catch (error) {
          console.error("Error al obtener áreas exteriores:", error);
        }
      }
    };
  
    fetchAreasExteriores();
  }, [relevamientoId]);

  // 🚀 Actualizar estado local cuando el usuario edita un campo
  const handleUpdateField = (
    id: number | undefined,
    field: keyof AreasExteriores,
    value: any
  ) => {
    setServicios((prev) =>
      prev.map((servicio) =>
        servicio.id === id ? { ...servicio, [field]: value } : servicio
      )
    );
  };

  // 🚀 Guardar cambios en la base de datos
  const handleGuardarCambios = async (id?: number) => {
    if (id === undefined) {
      toast.warning("No se encontró el área exterior a actualizar.");
      return;
    }
    const servicioActualizado = servicios.find((s) => s.id === id);

    if (!servicioActualizado) {
      toast.warning("No se encontró el área exterior a actualizar.");
      return;
    }

    try {
      await axios.put(`/api/areas_exteriores/${id}`, servicioActualizado);
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      toast.error("Hubo un error al actualizar los datos.");
    }
  };

  return (
    <div className="p-2 mx-10 mt-4 bg-white rounded-lg border shadow-lg">
      {columnsConfig.length > 0 ? (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-custom text-white text-center">
              {columnsConfig.map((column) => (
                <th
                  key={column.key}
                  className={`border p-2 text-center ${
                    column.key === "id" ? "bg-custom text-white" : ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id}>
                {columnsConfig.map((column) => (
                  <td
                    key={`${servicio.id}-${column.key}`}
                    className="border p-2"
                  >
                    {column.key === "tipo" ? (
                      servicio.tipo || "Desconocido" // Se mostró directamente el tipo
                    ) : column.key === "terminacion_piso" ? (
                      <select
                        value={servicio.terminacion_piso || ""}
                        onChange={(e) =>
                          handleUpdateField(
                            servicio.id,
                            "terminacion_piso",
                            e.target.value
                          )
                        }
                        className="border p-1"
                      >
                        <option value="">Seleccione...</option>
                        {terminacionPisoOpciones.map((opcion, index) => (
                          <option key={index} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </select>
                    ) : column.key === "estado_conservacion" ? (
                      <select
                        value={servicio.estado_conservacion || ""}
                        onChange={(e) =>
                          handleUpdateField(
                            servicio.id,
                            "estado_conservacion",
                            e.target.value
                          )
                        }
                        className="border p-1"
                      >
                        <option value="">Seleccione...</option>
                        {estadoConservacionOpciones.map((opcion, index) => (
                          <option key={index} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </select>
                    ) : (
                      String(servicio[column.key] ?? "")
                    )}
                  </td>
                ))}
                <td className="border p-2 justify-center items-center">
                  <button
                    onClick={() => handleGuardarCambios(servicio.id)}
                    className="text-sm font-bold bg-custom hover:bg-custom/50 text-white p-2 rounded-lg"
                  >
                    Cargar Información
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando opciones...</p>
      )}
    </div>
  );
};

export default AreasExterioresTable;
