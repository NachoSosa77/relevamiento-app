/* eslint-disable @typescript-eslint/no-explicit-any */
import { AreasExteriores } from '@/interfaces/AreaExterior';
import axios from 'axios';

// Obtener todas las áreas exteriores
 const getAreasExteriores = async (): Promise<AreasExteriores[]> => {
  try {
    const response = await axios.get(`/api/areas_exteriores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener áreas exteriores:', error);
    throw error;
  }
}; 

// Obtener un área exterior por relevamientoID
const getAreasExterioresByRelevamientoId = async (relevamientoId: number) => {
  if (!relevamientoId || isNaN(relevamientoId)) {
    console.warn("ID de relevamiento inválido");
    return [];
  }

  try {
    const response = await axios.get(`/api/areas_exteriores/by_relevamiento/${relevamientoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el área exterior:", error);
    throw error;
  }
};

// Crear una nueva área exterior
const postAreasExteriores = async (data: (AreasExteriores & { cui_number: number })[]) => {
  const res = await fetch("/api/areas_exteriores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // Intento leer el body del error para extraer mensaje y status
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = { message: "Error desconocido" };
    }

    const error = new Error(errorData.message || "Error al guardar las áreas exteriores");
    // Agrego custom property para el status
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

// Obtener opciones de tipos de áreas exteriores
const getOpcionesAreasExteriores = async () => {
  try {
    const response = await axios.get(`/api/areas_exteriores/opciones`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener opciones de áreas exteriores:', error);
    throw error;
  }
};
// Obtener opciones de tipos de áreas exteriores
const getOpcionesTerminacionPiso = async () => {
  try {
    const response = await axios.get(`/api/terminacion_piso/opciones`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener opciones de áreas exteriores:', error);
    throw error;
  }
};

const getAreasExterioresById = async (relevamientoId: number) => {
  try {
    const response = await axios.get(`/api/areas_exteriores/${relevamientoId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener opciones de áreas exteriores:', error);
    throw error;
  }
};

async function updateAreaExterior(id: number, data: any) {
  return axios.patch(`/api/areas_exteriores/${id}`, data).then((res) => res.data);
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
export const areasExterioresService = {
  postAreasExteriores,
  getOpcionesAreasExteriores,
  getOpcionesTerminacionPiso,
  getAreasExteriores,
  getAreasExterioresById,
  getAreasExterioresByRelevamientoId,
  updateAreaExterior
};
