/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { Column, ObrasEnPredio } from "@/interfaces/ObrasEnpredio";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { obrasEnpredioColumns } from "../config/obrasEnElPredio";

interface Opcion {
  id: number;
  label: string;
}
interface ObrasDentroDelPredioProps {
  mostrarObras: boolean;
}
const ObrasDentroDelPredio: React.FC<ObrasDentroDelPredioProps> = ({
  mostrarObras,
}) => {
  const [columnsConfig, setColumnsConfig] = useState<Column[]>([]);
  const [tipoOpciones, setTipoOpciones] = useState<Opcion[]>([]);
  const [estadoOpciones, setEstadoOpciones] = useState<string[]>([]);
  const [financiamientoOpciones, setFinanciamientoOpciones] = useState<
    string[]
  >([]);
  const [destinoOpciones, setDestinoOpciones] = useState<string[]>([]);
  const [obras, setObras] = useState<ObrasEnPredio[]>([
    {
      id: undefined, // La obra aún no existe en la BD
      tipo_obra: "",
      estado: "",
      financiamiento: "",
      destino: [],
      superficie_total: "",
      cue: null,
    },
  ]);

  const relevamientoId = useRelevamientoId();


  // 🚀 Cargar columnas configuradas
  useEffect(() => {
    const fetchColumns = async () => {
      const columns = await obrasEnpredioColumns();
      setColumnsConfig(columns);
    };
    fetchColumns();
  }, []);

  // 🚀 Cargar opciones de los select al inicio
  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const [tipoRes, estadoRes, financiamientoRes, destinoRes] =
          await Promise.all([
            axios.get("/api/obras_en_predio/opciones/tipo_obra"),
            axios.get("/api/obras_en_predio/opciones/estado_obra"),
            axios.get("/api/obras_en_predio/opciones/financiamiento_obra"),
            axios.get("/api/obras_en_predio/opciones/destino_obra"),
          ]);

        setTipoOpciones(
          tipoRes.data.map((op: any) => ({
            id: op.id,
            label: `${op.prefijo} - ${op.name}`,
          }))
        );
        setEstadoOpciones(estadoRes.data.map((op: any) => op.name));
        setFinanciamientoOpciones(
          financiamientoRes.data.map((op: any) => op.name)
        );
        setDestinoOpciones(
          destinoRes.data.map((op: any) => `${op.prefijo} - ${op.name}`)
        ); // Usar prefijo
      } catch (error) {
        console.error("Error al cargar opciones:", error);
      }
    };

    fetchOpciones();
  }, []);

  // 🚀 Actualizar estado local cuando el usuario edita un campo
  const handleUpdateField = (field: keyof ObrasEnPredio, value: any) => {
    setObras((prev) => [{ ...prev[0], [field]: value }]);
  };

  // 🚀 Guardar datos en la base de datos
  const handleGuardarCambios = async () => {
    try {
      const { id, ...obraSinId } = obras[0];

      // Validaciones
      if (
        !obraSinId.tipo_obra ||
        !obraSinId.estado ||
        !obraSinId.financiamiento ||
        !obraSinId.superficie_total ||
        obraSinId.cue === null ||
        !Array.isArray(obraSinId.destino) ||
        obraSinId.destino.length === 0
      ) {
        toast.warning(
          "⚠️ Por favor, completá todos los campos antes de guardar."
        );
        return;
      }

      // Agregar relevamiento_id
      const datosAEnviar = {
        ...obraSinId,
        relevamiento_id: relevamientoId,
      };


      await axios.post("/api/obras_en_predio", datosAEnviar);

      toast.success("✅ Datos guardados correctamente.");

      // Resetear el formulario
      setObras([
        {
          id: undefined,
          tipo_obra: "",
          estado: "",
          financiamiento: "",
          destino: [],
          superficie_total: "",
          cue: null,
        },
      ]);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      toast.error("❌ Hubo un error al guardar los datos.");
    }
  };

  const handleDestinoChange = (destino: string) => {
    setObras((prevObras) => {
      const obras = prevObras.map((obra) => {
        if (obra.destino.includes(destino)) {
          return {
            ...obra,
            destino: obra.destino.filter((d) => d !== destino),
          };
        } else {
          return {
            ...obra,
            destino: [...obra.destino, destino],
          };
        }
      });
      return obras;
    });
  };

  return (
    <div className="mx-8 my-6 border rounded-2xl">
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-gray-700">
            OBRAS DENTRO DEL PREDIO
          </p>
        </div>
        {mostrarObras && (
          <div>
            <div className="flex p-1 bg-gray-100 border text-sm">
              <p className="text-sm text-gray-400">
                Indique para cada una de las obras: tipo de obra, estado de
                avance y fuente de financiamiento (lea, en cada caso, todas las
                opciones de respuesta). Sólo para obra nueva o ampliación,
                indague acerca de la superficie, a qué CUE-Anexo corresponde y
                el destino previsto. Lea todas las opciones de respuesta y
                marque todas las que mencione el respondente.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-4 min-w-[900px]">
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
                  <tr>
                    {columnsConfig.map((column) => (
                      <td key={column.key} className="border p-2">
                        {column.key === "tipo_obra" ? (
                          <select
                            value={obras[0].tipo_obra}
                            onChange={(e) =>
                              handleUpdateField("tipo_obra", e.target.value)
                            }
                            className="border p-2 rounded-lg"
                          >
                            <option value="">Seleccione...</option>
                            {tipoOpciones.map((op) => (
                              <option key={op.id} value={op.label}>
                                {op.label}
                              </option>
                            ))}
                          </select>
                        ) : column.key === "estado" ? (
                          <select
                            value={obras[0].estado}
                            onChange={(e) =>
                              handleUpdateField("estado", e.target.value)
                            }
                            className="border p-2 rounded-lg"
                          >
                            <option value="">Seleccione...</option>
                            {estadoOpciones.map((op, index) => (
                              <option key={index} value={op}>
                                {op}
                              </option>
                            ))}
                          </select>
                        ) : column.key === "financiamiento" ? (
                          <select
                            value={obras[0].financiamiento}
                            onChange={(e) =>
                              handleUpdateField(
                                "financiamiento",
                                e.target.value
                              )
                            }
                            className="border p-2 rounded-lg"
                          >
                            <option value="">Seleccione...</option>
                            {financiamientoOpciones.map((op, index) => (
                              <option key={index} value={op}>
                                {op}
                              </option>
                            ))}
                          </select>
                        ) : column.key === "destino" ? (
                          <div className="grid grid-cols-3 gap-4">
                            {destinoOpciones.map((op, index) => {
                              const prefijo = op.split(" - ")[0]; // Obtener el prefijo
                              return (
                                <div key={index} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`destino-${index}`}
                                    value={op}
                                    checked={obras[0].destino.includes(op)}
                                    onChange={() => handleDestinoChange(op)}
                                    className="mr-2"
                                  />
                                  <label htmlFor={`destino-${index}`}>
                                    {prefijo}
                                  </label>{" "}
                                  {/* Mostrar solo el prefijo */}
                                </div>
                              );
                            })}
                          </div>
                        ) : column.key === "superficie_total" ||
                          column.key === "cue" ? (
                          <input
                            type="text"
                            placeholder={
                              column.key === "superficie_total"
                                ? "Superficie Total (m2)"
                                : "CUE-Anexo"
                            }
                            value={obras[0][column.key] || ""}
                            onChange={(e) =>
                              handleUpdateField(
                                column.key as keyof ObrasEnPredio,
                                e.target.value
                              )
                            }
                            className="border p-2 rounded-lg"
                          />
                        ) : (
                          String(obras[0][column.key] ?? "")
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col justify-center items-center bg-slate-200 text-slate-400 ">
              <p>
                Destino: A - Edificio completo para nivel inicial, B - Edificio
                completo para nivel primario, C - Edificio completo para nivel
                secundario
              </p>
              <p>
                D - Aulas comunes, E - Salas de Nivel Inicial, F - Otros locales
                pedagógicos
              </p>
              <p>G - Oficinas, H - Sanitarios, I - Cocina/comedor</p>
              <p>J - SUM, K - Áreas exteriores, L - Otros</p>
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
        )}
      </div>
    </div>
  );
};

export default ObrasDentroDelPredio;
