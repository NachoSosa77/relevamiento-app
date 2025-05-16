// src/services/institucionesService.ts
import axios from "axios";

export const institucionesService = {
  async getInstitucionesPorRelevamiento(relevamientoId: number) {
    try {
      const response = await axios.get(`/api/instituciones_por_relevamiento/${relevamientoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener instituciones:", error);
      throw error;
    }
  },
};
