import { Construccion, LocalesConstruccion } from '@/interfaces/Locales';
import axios from 'axios';

// Obtener opciones de locales
const getOpcionesLocales = async () => {
  try {
    const response = await axios.get(`/api/locales_por_construccion/opciones`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener opciones de áreas exteriores:', error);
    throw error;
  }
};

// Guardar locales
const postLocales = async (data: (LocalesConstruccion & { construccion_id: number })[]) => {
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
};

const postConstrucciones = async (data: Construccion) => {
  const res = await fetch("/api/construcciones", {
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
    throw new Error("Error al guardar la construcción");
  }

  return res.json();
};


// Obtener locales por relevamiento
const getLocalesPorRelevamiento = async (relevamientoId: number) => {
  try {
    const response = await axios.get(`/api/locales_por_construccion/by_relevamiento/${relevamientoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener locales por relevamiento:", error);
    throw error;
  }
};

// Obtener un local por su ID
const getLocalById = async (localId: number) => {
  try {
    const response = await axios.get(`/api/locales_por_construccion/${localId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el local por id:", error);
    throw error;
  }
};

const getLocalesByConstruccionId = async (construccionId: number | undefined) => {
  try {
    const response = await axios.get(`/api/locales_por_construccion/construccion/${construccionId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los locales:", error);
    throw error;
  }
};

const updateConstruccionById = async (id: number, data: { destino_original: string }) => {
  const response = await fetch(`/api/locales_por_construccion/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar destino_original");
  }

  return await response.json();
};

const updateConstruccionAntiRoboById = async (
  id: number,
  data: { proteccion_contra_robo: string }
) => {
  const response = await fetch(`/api/locales_por_construccion/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar proteccion_contra_robo");
  }

  return await response.json();
};


export const updateDimensionesById = async (
  id: number,
  data: {
    largo_predominante: number;
    ancho_predominante: number;
    diametro: number;
    altura_maxima: number;
    altura_minima: number;
  }
) => {
  const response = await fetch(`/api/locales_por_construccion/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar dimensiones");
  }

  return await response.json();
};

export const updateEstadoLocal = async (
  id: number,
  estado: string
) => {
  const response = await fetch(`/api/locales_por_construccion/${id}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado }), // <-- aquí usas el parámetro recibido
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el estado del local");
  }

  return await response.json();
};




// Exportar las funciones como un servicio
export const localesService = {
  getOpcionesLocales,
  postLocales,
  postConstrucciones,
  getLocalesPorRelevamiento,
  getLocalById, // Agregamos el nuevo servicio
  updateConstruccionById,
  updateDimensionesById,
  updateConstruccionAntiRoboById,
  getLocalesByConstruccionId,
  updateEstadoLocal
};
