/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { AreasExteriores, Column } from "@/interfaces/AreaExterior";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { areasExterioresColumns } from "../config/areaExterior";

interface Opcion {
  id: number;
  label: string;
}

interface AreasExterioresTableProps {
  predioId: number | null;
}

const AreasExterioresTable: React.FC<AreasExterioresTableProps> = ({ predioId }) => {
  const relevamientoId = useRelevamientoId();
  const [columnsConfig, setColumnsConfig] = useState<Column[]>([]);
  const [servicios, setServicios] = useState<AreasExteriores[]>([]);
  const [tipoOpciones, setTipoOpciones] = useState<Opcion[]>([]);
  const [terminacionPisoOpciones, setTerminacionPisoOpciones] = useState<string[]>([]);
  const estadoConservacionOpciones = ["Bueno", "Malo", "Regular"];
  const [isSubmitting, setIsSubmitting] = useState(false);

  // columnas
  useEffect(() => {
    const fetchColumns = async () => {
      const columns = await areasExterioresColumns();
      setColumnsConfig(columns);
    };
    fetchColumns();
  }, []);

  // opciones de tipo de área
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

  // opciones terminación de piso
  useEffect(() => {
    const fetchOpcionesTerminacionPiso = async () => {
      try {
        const response = await axios.get("/api/terminacion_piso/opciones");
        setTerminacionPisoOpciones(response.data);
      } catch (error) {
        console.error("Error al obtener opciones de terminación del piso:", error);
      }
    };
    fetchOpcionesTerminacionPiso();
  }, []);

  // fetch de áreas por relevamiento (lo reutilizamos tras guardar)
  const fetchAreas = useCallback(async () => {
    if (!relevamientoId) return;
    try {
      const response = await axios.get(`/api/areas_exteriores/by_relevamiento/${relevamientoId}`);
      setServicios(response.data.areasExteriores || []);
    } catch (error) {
      console.error("Error al obtener áreas exteriores:", error);
    }
  }, [relevamientoId]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  // edición local de celdas
  const handleUpdateField = (
    id: number | undefined,
    field: keyof AreasExteriores,
    value: any
  ) => {
    setServicios(prev =>
      prev.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  // guardar TODO con un solo botón
  const handleGuardarTodo = async () => {
    if (!servicios.length) {
      toast.info("No hay áreas para actualizar.");
      return;
    }
    setIsSubmitting(true);

    try {
      const requests = servicios.map(s => {
        if (!s.id) return null; // por seguridad
        return axios.put(`/api/areas_exteriores/${s.id}`, {
          ...s,
          predio_id: predioId ?? null, // aseguramos que viaje
        });
      }).filter(Boolean) as Promise<any>[];

      const results = await Promise.allSettled(requests);

      const rechazadas = results.filter(r => r.status === "rejected");
      if (rechazadas.length === 0) {
        toast.success("Datos actualizados correctamente");
      } else if (rechazadas.length < results.length) {
        toast.warning("Algunas filas no pudieron actualizarse. Reintentá.");
      } else {
        toast.error("No se pudieron actualizar las áreas exteriores.");
      }

      // Refrescar desde DB para ver lo persistido
      await fetchAreas();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar las áreas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2 mx-10 mt-4 bg-white rounded-lg border shadow-lg">
      {/* Título pedido */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom text-sm font-semibold">
          <p>4</p>
        </div>
        <h3 className="text-sm font-semibold text-gray-700">ÁREAS EXTERIORES</h3>
      </div>

      {columnsConfig.length > 0 ? (
        <>
          <table className="w-full border-collapse mt-2">
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
                        servicio.tipo || "Desconocido"
                      ) : column.key === "terminacion_piso" ? (
                        <select
                          value={servicio.terminacion_piso || ""}
                          onChange={(e) =>
                            handleUpdateField(servicio.id, "terminacion_piso", e.target.value)
                          }
                          className="border p-1"
                          disabled={isSubmitting}
                        >
                          <option value="">Seleccione...</option>
                          {terminacionPisoOpciones.map((op, idx) => (
                            <option key={idx} value={op}>
                              {op}
                            </option>
                          ))}
                        </select>
                      ) : column.key === "estado_conservacion" ? (
                        <select
                          value={servicio.estado_conservacion || ""}
                          onChange={(e) =>
                            handleUpdateField(servicio.id, "estado_conservacion", e.target.value)
                          }
                          className="border p-1"
                          disabled={isSubmitting}
                        >
                          <option value="">Seleccione...</option>
                          {estadoConservacionOpciones.map((op, idx) => (
                            <option key={idx} value={op}>
                              {op}
                            </option>
                          ))}
                        </select>
                      ) : (
                        String(servicio[column.key] ?? "")
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Único botón para guardar todo */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleGuardarTodo}
              className="text-sm font-bold bg-custom hover:bg-custom/50 text-white p-2 rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </>
      ) : (
        <p>Cargando opciones...</p>
      )}
    </div>
  );
};

export default AreasExterioresTable;
