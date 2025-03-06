import { Column } from "@/interfaces/AreaExterior";
import axios from "axios";

export const getOpcionesTipoArea = async (): Promise<
  { id: number; label: string }[]
> => {
  try {
    const response = await axios.get("/api/areas_exteriores/opciones");
    return response.data.map(
      (opcion: { id: number; name: string; prefijo: string }) => ({
        id: opcion.id,
        label: `${opcion.prefijo} - ${opcion.name}`, // ✅ Formato correcto
      })
    );
  } catch (error) {
    console.error("Error al obtener opciones de tipo de área:", error);
    return [];
  }
};

export const getOpcionesTerminacionPiso = async (): Promise<string[]> => {
  try {
    const response = await axios.get("/api/terminacion_piso/opciones");
    return response.data;
  } catch (error) {
    console.error("Error al obtener opciones de terminación del piso:", error);
    return [];
  }
};

export const areasExterioresColumns = async (): Promise<Column[]> => {
  const opcionesTipoArea = await getOpcionesTipoArea();
  const opcionesTerminacionPiso = await getOpcionesTerminacionPiso();

  return [
    { header: "5", key: "id", type: "text" },
    {
      header: "N° de identificación en el plano",
      key: "identificacion_plano",
      type: "text",
    },
    {
      header: "Tipo de área",
      key: "tipo",
      type: "select",
      options: opcionesTipoArea, // ✅ Usa opciones dinámicas
    },
    {
      header: "Terminación del piso",
      key: "terminacion_piso",
      type: "select",
      options: opcionesTerminacionPiso, // ✅ Ahora usa el formato "A - Baldosas/mosaicos"
    },
    {
      header: "Estado de conservación",
      key: "estado_conservacion",
      type: "select",
      options: ["Bueno", "Malo", "Regular"], // ✅ Opciones fijas
    },
  ];
};
