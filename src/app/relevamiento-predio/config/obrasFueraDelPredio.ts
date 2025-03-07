import { Column } from "@/interfaces/ObrasFueraPredio";
import axios from "axios";

export const getOpcionesTipoObra = async (): Promise<
  { id: number; label: string }[]
> => {
  try {
    const response = await axios.get("/api/obras_en_predio/opciones/tipo_obra");
    return response.data.map(
      (opcion: { id: number; name: string; prefijo: string }) => ({
        id: opcion.id,
        label: `${opcion.prefijo} - ${opcion.name}`, // ✅ Formato correcto
      })
    );
  } catch (error) {
    console.error("Error al obtener opciones de tipo de obra:", error);
    return [];
  }
};

export const getOpcionesDestinoObra = async (): Promise<
  { id: number; label: string }[]
> => {
  try {
    const response = await axios.get(
      "/api/obras_en_predio/opciones/destino_obra"
    );
    return response.data.map(
      (opcion: { id: number; name: string; prefijo: string }) => ({
        id: opcion.id,
        label: `${opcion.prefijo} - ${opcion.name}`, // ✅ Formato correcto
      })
    );
  } catch (error) {
    console.error("Error al obtener opciones de destino de obra:", error);
    return [];
  }
};

export const obrasFueraPredioColumns = async (): Promise<Column[]> => {
  const opcionesTipoObra = await getOpcionesTipoObra();
  const opcionesDestinoObra = await getOpcionesDestinoObra();

  return [
    { header: "7", key: "id", type: "text" },
    {
      header: "Tipo de obra",
      key: "tipo_obra",
      type: "select",
      options: opcionesTipoObra, // ✅ Usa opciones dinámicas
    },
    {
      header: "Domicilio",
      key: "domicilio",
      type: "text",
    },
    {
      header: "CUE-Anexo",
      key: "cue",
      type: "text",
    },
    {
      header: "Destino",
      key: "destino",
      type: "select",
      options: opcionesDestinoObra, // ✅ Usa opciones dinámicas
    },
  ];
};
