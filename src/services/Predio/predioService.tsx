import axios from "axios";

export const predioService = {
  async getPredioByRelevamientoId(relevamientoId: number) {
    try {
      const response = await axios.get(`/api/predio/${relevamientoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener predio:", error);
      throw error;
    }
  },
};
