/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Select from "@/components/ui/SelectComponent";
import TextInput from "@/components/ui/TextInput";
import axios from "axios";
import { useState } from "react";
import { antiguedadDestinoOpciones } from "../config/antiguedadDestinoOpciones";

interface ConstruccionAntiguedad {
  id?: number;
  ano: string;
  destino: string;
}

export default function AntiguedadComponent() {
  const [antiguedad, setAntiguedad] = useState<ConstruccionAntiguedad>({
    ano: "",
    destino: "",
  });

  const [loading, setLoading] = useState(false);

  const handleGuardarCambios = async () => {
    if (!antiguedad.ano.trim() || !antiguedad.destino) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    setLoading(true);

    try {
      // Obtener el objeto completo basado en el ID seleccionado
      const destinoSeleccionado = antiguedadDestinoOpciones.find(
        (option) => option.id === Number(antiguedad.destino)
      );

      if (!destinoSeleccionado) {
        alert("Destino no válido.");
        setLoading(false);
        return;
      }

      const payload = {
        ano: antiguedad.ano,
        destino: destinoSeleccionado.name, // Enviar 'name' en lugar de 'id'
      };

      await axios.post("/api/antiguedad_construccion", payload);

      alert("Datos guardados correctamente");
      setAntiguedad({ ano: "", destino: "" });
    } catch (error: any) {
      console.error("Error al guardar los datos:", error);
      alert(
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
          <p className="px-2 text-sm font-bold">ANTIGUEDAD Y DESTINO ORIGINAL DE LA CONSTRUCCIÓN</p>
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
                    onChange={(e) => setAntiguedad({...antiguedad, ano: e.target.value })}
                    />
                </div>
                <div className="font-bold bg-slate-200 flex gap-2 p-2">
                    <p>2.2</p>
                    <p>¿Para qué destino fue construida originariamente? (Lea todas las opciones de respuesta)</p>
                </div>
                <div>
                    <Select
                    label=""
                    value={antiguedad.destino}
                    options={antiguedadDestinoOpciones.map((option) => ({
                        value: option.id,
                        label: option.name,
                    }))}
                    onChange={(e) => setAntiguedad({...antiguedad, destino: e.target.value })}
                    />
                </div>
            </div>
        </form>
      </div>
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
