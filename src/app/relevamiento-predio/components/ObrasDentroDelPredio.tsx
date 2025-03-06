/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, ObrasEnPredio } from "@/interfaces/ObrasEnpredio";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { obrasEnpredioColumns } from "../config/obrasEnElPredio";

interface Opcion {
  id: number;
  label: string;
}

const ObrasDentroDelPredio: React.FC = () => {
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
      destino: "",
      superficie_total: "",
      cue: null,
    },
  ]);

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
        setDestinoOpciones(destinoRes.data.map((op: any) => op.name));
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
      const { id, ...obraSinId } = obras[0]; // Excluye el id antes de enviar

      if (
        !obraSinId.tipo_obra ||
        !obraSinId.estado ||
        !obraSinId.financiamiento ||
        !obraSinId.destino ||
        !obraSinId.superficie_total ||
        obraSinId.cue === null
      ) {
        alert("Por favor, complete todos los campos.");
        return;
      }
      console.log(obraSinId)
      await axios.post("/api/obras_en_predio", obraSinId);
      alert("Datos guardados correctamente");
      // 🚀 Resetear el formulario después de guardar
    setObras([
      {
        id: undefined,
        tipo_obra: "",
        estado: "",
        financiamiento: "",
        destino: "",
        superficie_total: "",
        cue: null,
      },
    ]);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Hubo un error al guardar los datos.");
    }
  };

  return (
    <div className="p-4 mx-10">
      <div className="mt-2 border items-center">
        <div className="w-10">
          <p className="text-sm font-bold justify-center ml-4">
            OBRAS DENTRO DEL PREDIO
          </p>
        </div>
      </div>
      <div className="flex p-1 bg-gray-100 border text-sm">
        <p className="text-sm text-gray-400">
          Transcriba de la hoja de ruta la denominación de los establecimientos
          educativos que funcionan en el predio y el Número de CUE-Anexo de cada
          uno de ellos. En caso de que el directivo mencione un CUE-Anexo
          usuario que no está consignado en la Hoja de ruta, se deberá agregar,
          completando los datos correspondientes.
        </p>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full border-collapse mt-4 min-w-[900px]">
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
                      handleUpdateField("financiamiento", e.target.value)
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
                  <select
                    value={obras[0].destino}
                    onChange={(e) =>
                      handleUpdateField("destino", e.target.value)
                    }
                    className="border p-2 rounded-lg"
                  >
                    <option value="">Seleccione...</option>
                    {destinoOpciones.map((op, index) => (
                      <option key={index} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                ) : column.key === "superficie_total" ||
                  column.key === "cue" ? (
                  <input
                    type="text"
                    placeholder={ column.key === "superficie_total" ? "Superficie Total (m2)" : "CUE-Anexo" }
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
};

export default ObrasDentroDelPredio;
