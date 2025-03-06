import { Column } from "@/interfaces/ObrasEnpredio";
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

export const getOpcionesEstadoObra = async (): Promise<
  { id: number; label: string }[]
> => {
  try {
    const response = await axios.get(
      "/api/obras_en_predio/opciones/estado_obra"
    );
    return response.data.map(
      (opcion: { id: number; name: string; prefijo: string }) => ({
        id: opcion.id,
        label: `${opcion.prefijo} - ${opcion.name}`, // ✅ Formato correcto
      })
    );
  } catch (error) {
    console.error("Error al obtener opciones de estado de obra:", error);
    return [];
  }
};

export const getOpcionesFinanciamientoObra = async (): Promise<
  { id: number; label: string }[]
> => {
  try {
    const response = await axios.get(
      "/api/obras_en_predio/opciones/financiamiento_obra"
    );
    return response.data.map(
      (opcion: { id: number; name: string; prefijo: string }) => ({
        id: opcion.id,
        label: `${opcion.prefijo} - ${opcion.name}`, // ✅ Formato correcto
      })
    );
  } catch (error) {
    console.error(
      "Error al obtener opciones de financiamiento de obra:",
      error
    );
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

export const obrasEnpredioColumns = async (): Promise<Column[]> => {
  const opcionesTipoObra = await getOpcionesTipoObra();
  const opcionesEstadoObra = await getOpcionesEstadoObra();
  const opcionesFinanciamientoObra = await getOpcionesFinanciamientoObra();
  const opcionesDestinoObra = await getOpcionesDestinoObra();

  return [
    { header: "6", key: "id", type: "text" },
    {
      header: "Tipo de obra",
      key: "tipo_obra",
      type: "select",
      options: opcionesTipoObra, // ✅ Usa opciones dinámicas
    },
    {
      header: "Estado de avance",
      key: "estado",
      type: "select",
      options: opcionesEstadoObra, // ✅ Usa opciones dinámicas
    },
    {
      header: "Fuente de financiamiento",
      key: "financiamiento",
      type: "select",
      options: opcionesFinanciamientoObra, // ✅ Usa opciones dinámicas
    },
    {
      header: "Superficie total",
      key: "superficie_total",
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
