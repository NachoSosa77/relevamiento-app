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

// Crear una nueva área exterior
const postAreasExteriores = async (data: (AreasExteriores & { cui_number: number })[]) => {
    const res = await fetch("/api/areas_exteriores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Respuesta del servidor:", errorData);
    throw new Error("Error al guardar las áreas exteriores");
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
  getAreasExteriores
};
