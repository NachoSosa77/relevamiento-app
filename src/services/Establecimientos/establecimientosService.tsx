import { InstitucionesData } from '@/interfaces/Instituciones';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Url de la API

const getAllEstablecimientos = async (): Promise<InstitucionesData[]> => {
    try {
      const response = await axios.get(`${API_URL}/instituciones`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener establecimientos:', error);
      throw error; // Re-lanza el error para que se pueda manejar en el componente
    }
  };
  
const getEstablecimientoByCue = async (cue: number): Promise<InstitucionesData> => {
    try {
      const response = await axios.get(`${API_URL}/instituciones/${cue}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener establecimiento por CUE:', error);
      throw error;
    }
  };
  
export const establecimientosService = {
    getAllEstablecimientos,
    getEstablecimientoByCue,
}; 
