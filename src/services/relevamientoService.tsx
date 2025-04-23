/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const relevamientoService = {
  createRelevamiento: async (cui: number) => {
    try {
      const response = await axios.post("/api/relevamientos", { cui });
      return response.data;
    } catch (error: any) {
      throw new Error("Error al crear el relevamiento: " + error.message);
    }
  },
  getRelevamientoByCui: async (cui: number) => {
    try {
      const response = await axios.get(`/api/relevamientos/${cui}`);
      return response.data;
    } catch (error: any) {
      throw new Error("Error al obtener el relevamiento: " + error.message);
    }
  },
  getRelevamientoById: async (id: number) => {
    const response = await axios.get(`/api/relevamientos/id/${id}`);
    return response.data;
  },
};
