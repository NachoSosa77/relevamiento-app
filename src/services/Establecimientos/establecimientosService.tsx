import { InstitucionesData } from '@/interfaces/Instituciones';
import axios from 'axios';


const getAllEstablecimientos = async () => {
    try {
      const response = await axios.get(`/api/instituciones`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error al obtener establecimientos:', error);
      throw error; // Re-lanza el error para que se pueda manejar en el componente
    }
  };
  
const getEstablecimientoByCue = async (cue: number): Promise<InstitucionesData> => {
    try {
      const response = await axios.get(`/api/instituciones/${cue}`);
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
