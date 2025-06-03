import { InstitucionesData } from '@/interfaces/Instituciones';
import axios from 'axios';


const getAllEstablecimientos = async () => {
    try {
      const response = await axios.get(`/api/instituciones`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener establecimientos:', error);
      throw error; // Re-lanza el error para que se pueda manejar en el componente
    }
  };
  
const getEstablecimientoByCui = async (cui: number): Promise<InstitucionesData> => {
    try {
      const response = await axios.get(`/api/instituciones/${cui}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener establecimiento por CUE:', error);
      throw error;
    } 
  };
  
export const establecimientosService = {
    getAllEstablecimientos,
    getEstablecimientoByCui,
}; 
