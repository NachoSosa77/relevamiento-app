import { AreasExteriores } from '@/interfaces/AreaExterior';
import axios from 'axios';

const getAllAreasExteriores = async (): Promise<AreasExteriores[]> => {
    try {
      const response = await axios.get(`/api/areas_exteriores`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener establecimientos:', error);
      throw error; // Re-lanza el error para que se pueda manejar en el componente
    }
  };
  
const getAreasExterioresById = async (id: number): Promise<AreasExteriores> => {
    try {
      const response = await axios.get(`/api/areas_exteriores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener establecimiento por CUE:', error);
      throw error;
    }
  };

const postAreasExteriores = async (formData: AreasExteriores) => {
    try {
        const response = await axios.post(`/api/areas_exteriores`, formData);
        return response.data;
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

const getOpcionesAreasExteriores = async () => {
  try {
    const response = await axios.get(`/api/areas_exteriores/opciones`);
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
