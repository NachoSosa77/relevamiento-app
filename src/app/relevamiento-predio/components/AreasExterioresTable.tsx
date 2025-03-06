/* eslint-disable @typescript-eslint/no-explicit-any */
import { AreasExteriores, Column } from "@/interfaces/AreaExterior";
import { areasExterioresService } from "@/services/areasExterioresService";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { areasExterioresColumns } from "../config/areaExterior";

interface Opcion {
  id: number;
  label: string;
}

const AreasExterioresTable: React.FC = () => {
  const [columnsConfig, setColumnsConfig] = useState<Column[]>([]);
  const [servicios, setServicios] = useState<AreasExteriores[]>([]);
  const [areaId, setAreaId] = useState<number | null>(null);
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

  // 🚀 Cargar datos de un área específica
  useEffect(() => {
    if (areaId) {
      fetchAreaData(areaId);
    }
  }, [areaId]);

  const fetchAreaData = async (id: number) => {
    try {
      const data = await areasExterioresService.getAreasExterioresById(id);
      setServicios([data]);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

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
    console.log("ID recibido:", id);
    console.log("Servicios actuales:", servicios);
    if (id === undefined) {
      alert("No se encontró el área exterior a actualizar.");
      return;
    }
    const servicioActualizado = servicios.find((s) => s.id === id);
    console.log("Servicio encontrado:", servicioActualizado);

    if (!servicioActualizado) {
      alert("No se encontró el área exterior a actualizar.");
      return;
    }

    try {
      await axios.put(`/api/areas_exteriores/${id}`, servicioActualizado);
      alert("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      alert("Hubo un error al actualizar los datos.");
    }
  };

  /* // 🚀 Manejar el cambio en la selección de terminación de piso
  const handleUpdateTerminacionPiso = (id: number, value: string) => {
    setServicios((prev) =>
      prev.map((servicio) =>
        servicio.id === id ? { ...servicio, terminacion_piso: value } : servicio
      )
    );
  }; */

  return (
    <div className="p-4 mx-10">
      <div>
        <label className="text-sm mr-4">ID del Área Exterior:</label>
        <input
          type="number"
          value={areaId || ""}
          onChange={(e) => setAreaId(Number(e.target.value))}
          className="border p-1 rounded-lg"
        />
      </div>

      {columnsConfig.length > 0 ? (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              {columnsConfig.map((column) => (
                <th key={column.key} className={`border p-2 text-left ${
                  column.key === "id" ? "bg-black text-white" : ""
                }`}>
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
                    {/* Mostrar el nombre en lugar del ID en "Tipo de Área" */}
                    {column.key === "tipo" ? (
                      tipoOpciones.find(
                        (opcion) => opcion.id === Number(servicio.tipo)
                      )?.label || "Desconocido"
                    ) : column.key === "terminacion_piso" ? (
                      // Mostrar un select en "Terminación del piso"
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
                    className="text-sm font-bold bg-slate-200 p-4 rounded-md flex-nowrap"
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
