/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { antiguedadDestinoOpciones } from "../config/antiguedadDestinoOpciones";

interface Props {
  construccionId: number | null;
}

export default function AntiguedadComponent({ construccionId }: Props) {
  const [antiguedad, setAntiguedad] = useState({ ano: "", destino: "" });
  const [loading, setLoading] = useState(false);
  const [construccionEnviada, setConstruccionEnviada] = useState<{
    antiguedad: string;
    destino: string;
  } | null>(null);

  const handleGuardarCambios = async () => {
    if (!antiguedad.ano.trim() || !antiguedad.destino) {
      toast.warning("Por favor, complete todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        antiguedad: antiguedad.ano,
        destino: antiguedad.destino,
      };

      await axios.patch(`/api/construcciones/${construccionId}`, payload);

      toast.success("Datos de antigüedad y destino actualizados correctamente");
      setConstruccionEnviada(payload);
      setAntiguedad({ ano: "", destino: "" });
    } catch (error: any) {
      console.error("Error al guardar los datos:", error);
      toast.error(
        `Hubo un error al guardar los datos: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-10 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-sm">
      <div className="flex items-center gap-2 mt-2 p-2 border rounded-2xl shadow-lg bg-white text-black">
        <div className="w-8 h-8 rounded-full flex justify-center items-center text-white bg-custom">
          <p>2</p>
        </div>
        <div className="h-6 flex items-center justify-center">
          <p className="px-2 text-sm font-bold">
            ANTIGUEDAD Y DESTINO ORIGINAL DE LA CONSTRUCCIÓN
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-center items-center p-2 mt-2 text-sm gap-2">
            <div className="flex gap-2 p-2">
              <p>2.1</p>
              <p>¿De qué año data la mayor parte de la construcción?</p>
            </div>
            <div>
              <TextInput
                sublabel="Año - No sabe"
                label=""
                value={antiguedad.ano}
                onChange={(e) =>
                  setAntiguedad({ ...antiguedad, ano: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 p-2">
              <p>2.2</p>
              <p>
                ¿Para qué destino fue construida originariamente? (Lea todas las
                opciones de respuesta)
              </p>
            </div>
            <div>
              <Select
                label=""
                value={antiguedad.destino}
                options={antiguedadDestinoOpciones.map((option) => ({
                  value: option.id,
                  label: option.name,
                }))}
                onChange={(e) => {
                  const selectedOption = antiguedadDestinoOpciones.find(
                    (option) => option.id === Number(e.target.value)
                  );
                  if (selectedOption) {
                    setAntiguedad({
                      ...antiguedad,
                      destino: selectedOption.name,
                    });
                  }
                }}
              />
            </div>
          </div>
        </form>
      </div>

      {construccionEnviada && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Datos enviados:</h3>
          <table className="table-auto w-full text-left bg-white shadow-md rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 font-semibold text-gray-700">Campo</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">Año:</td>
                <td className="px-4 py-2">{construccionEnviada.antiguedad}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">Destino:</td>
                <td className="px-4 py-2">{construccionEnviada.destino}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={handleGuardarCambios}
          className={`text-sm font-bold p-2 rounded-lg flex-nowrap ${
            loading ? "bg-custom cursor-not-allowed" : "text-white bg-custom hover:bg-custom/50"
          }`}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Información"}
        </button>
      </div>
    </div>
  );
}
