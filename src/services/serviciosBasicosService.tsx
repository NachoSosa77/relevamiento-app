import axios from "axios";


const getServiciosBasicosByRelevamientoId = async (relevamientoId: number) => {
  try {
    const response = await axios.get(`/api/servicios_basicos_predio/${relevamientoId}`);
    return response.data.serviciosBasicos;
  } catch (error) {
    console.error('Error al obtener el área exterior:', error);
    throw error;
  }
}; 
export const serviciosBasicosService = {
  getServiciosBasicosByRelevamientoId
};
