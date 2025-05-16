// src/services/institucionesService.ts
import axios from "axios";

export const respondientesService = {
  async getRespondientesPorRelevamiento(relevamientoId: number) {
    try {
      const response = await axios.get(`/api/respondientes/${relevamientoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener respondientes:", error);
      throw error;
    }
  },
};
