import { LocalesConstruccion } from '@/interfaces/Locales';
import axios from 'axios';

// Obtener todas las áreas exteriores
/* const getAllAreasExteriores = async (): Promise<AreasExteriores[]> => {
  try {
    const response = await axios.get(`/api/areas_exteriores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener áreas exteriores:', error);
    throw error;
  }
}; */

// Obtener un área exterior por ID
/* const getAreasExterioresById = async (id: number): Promise<AreasExteriores> => {
  try {
    const response = await axios.get(`/api/areas_exteriores/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el área exterior:', error);
    throw error;
  }
}; */


const getOpcionesLocales = async () => {
  try {
    const response = await axios.get(`/api/locales_por_construccion/opciones`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener opciones de áreas exteriores:', error);
    throw error;
  }
};

const postLocales = async (data: (LocalesConstruccion & { cui_number: number })[]) => {
  const res = await fetch("/api/locales_por_construccion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("Content-Type");

  if (!res.ok) {
    const errorData = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    console.error("Error del servidor:", errorData);
    throw new Error("Error al guardar los locales");
  }

  return res.json();
}

// Actualizar un área exterior por ID
/* const updateAreasExteriores = async (id: number, formData: AreasExteriores) => {
  try {
    const response = await axios.put(`/api/areas_exteriores/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el área exterior:', error);
    throw error;
  }
}; */

// Exportar las funciones como un servicio
export const localesService = {
  getOpcionesLocales,
  postLocales
};
