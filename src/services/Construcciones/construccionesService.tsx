import axios from "axios";

export const construccionService = {
  async getConstruccionByNumero(relevamientoId: number, numero: number) {
    const response = await axios.get(`/api/construcciones`, {
      params: {
        relevamiento_id: relevamientoId,
        numero,
      },
    });

    return response.data;
  },
};
