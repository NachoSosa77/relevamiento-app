import { AreasExteriores } from '@/interfaces/AreaExterior';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Url de la API

const getAllAreasExteriores = async (): Promise<AreasExteriores[]> => {
    try {
      const response = await axios.get(`${API_URL}/areas-exteriores`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener establecimientos:', error);
      throw error; // Re-lanza el error para que se pueda manejar en el componente
    }
  };
  
const getAreasExterioresById = async (id: number): Promise<AreasExteriores> => {
    try {
      const response = await axios.get(`${API_URL}/areas-exteriores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener establecimiento por CUE:', error);
      throw error;
    }
  };

const postAreasExteriores = async (formData: AreasExteriores) => {
    try {
        const response = await axios.post(`${API_URL}/areas-exteriores`, formData);
        return response.data;
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

const getOpcionesAreasExteriores = async () => {
  try {
    const response = await axios.get(`${API_URL}/opciones-areas-exteriores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener establecimientos:', error);
    throw error; // Re-lanza el error para que se pueda manejar en el componente
  }
}
  
export const areasExterioresService = {
    getAllAreasExteriores,
    getAreasExterioresById,
    postAreasExteriores,
    getOpcionesAreasExteriores
}; 
