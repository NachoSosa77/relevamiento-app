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

  async getConstruccionesById(id: number) {
    const response = await axios.get(`/api/construcciones/${id}`, {
    });
    return response;
  },
  async getByRelevamientoId(id: number) {
    const res = await fetch(`/api/construcciones?relevamiento_id=${id}`);
    if (!res.ok) throw new Error("Error al obtener construcciones");
    return await res.json();
  },

}
