// src/services/Predio/predioService.ts
import axios from "axios";

export const predioService = {
  async getPredioByRelevamientoId(relevamientoId: number) {
    try {
      const { data } = await axios.get("/api/predio", {
        params: { relevamiento_id: relevamientoId }, // 👈 esta es tu ruta GET existente
      });
      return data;
    } catch (error) {
      console.error("Error al obtener predio:", error);
      throw error;
    }
  },
};
