/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import { useAppSelector } from "@/redux/hooks";
import { setConstruccionEnviada } from "@/redux/slices/construccionesSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { antiguedadDestinoOpciones } from "../config/antiguedadDestinoOpciones";

export default function AntiguedadComponent() {
  const { numero_construccion, relevamiento_id, instituciones_ids, plantas } =
    useAppSelector((state) => state.construcciones.construccionTemporal) || {};
  const dispatch = useDispatch();
  const construccionEnviada = useAppSelector(
    (state) => state.construcciones.construccionEnviada
  );
  const [antiguedad, setAntiguedad] = useState({ ano: "", destino: "" });
  const [loading, setLoading] = useState(false);

  const handleGuardarCambios = async () => {
    // Validación de campos antes de continuar
    if (!antiguedad.ano.trim() || !antiguedad.destino) {
      toast("Por favor, complete todos los campos.");
      return;
    }

    // Si la validación pasó, crear el payload y continuar con el flujo
    setLoading(true);

    try {
      // Paso 1: Crear la construcción
      const payload = {
        numero_construccion: numero_construccion!,
        relevamiento_id: relevamiento_id!,
        antiguedad: antiguedad.ano,
        destino: antiguedad.destino,
        instituciones_ids: instituciones_ids || [],
      };

      const { data: construccionData } = await axios.post(
        "/api/construcciones",
        payload
      );
      const construccion_id = construccionData.id;

      // Paso 2: Crear las plantas con el construccion_id
      const plantasPayload = {
        construccion_id,
        plantas, // Usamos el estado de Redux para las plantas
      };
      await axios.post("/api/plantas", plantasPayload);

      // Paso 3: Relacionar la construcción con las instituciones
      const institucionesPayload = (instituciones_ids || []).map(
        (institucion_id) => ({
          construccion_id,
          institucion_id,
        })
      );

      console.log("Datos de instituciones a enviar:", institucionesPayload);

      await axios.post("/api/construccion_institucion", institucionesPayload);

      // Actualizar el estado de Redux con los datos enviados
      dispatch(setConstruccionEnviada(payload));

      toast("Construcción, plantas e instituciones guardadas correctamente");
      setAntiguedad({ ano: "", destino: "" });
    } catch (error: any) {
      console.error("Error al guardar los datos:", error);
      toast(
        `Hubo un error al guardar los datos: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-10">
      <div className="flex items-center gap-2 mt-2 p-2 border">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
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
          <div className="flex justify-center items-center p-2 text-sm gap-2">
            <div className="font-bold bg-slate-200 flex gap-2 p-2">
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
            <div className="font-bold bg-slate-200 flex gap-2 p-2">
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
                  value: option.id, // Esto sigue siendo el 'id' para la opción
                  label: option.name, // 'name' es lo que se muestra
                }))}
                onChange={(e) => {
                  const selectedOption = antiguedadDestinoOpciones.find(
                    (option) => option.id === Number(e.target.value)
                  );
                  if (selectedOption) {
                    setAntiguedad({
                      ...antiguedad,
                      destino: selectedOption.name,
                    }); // Guardamos 'name' en el estado
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
          className={`text-sm font-bold p-4 rounded-md flex-nowrap ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-slate-200"
          }`}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Información"}
        </button>
      </div>
    </div>
  );
}
