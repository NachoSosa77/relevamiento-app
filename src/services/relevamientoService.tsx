/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const relevamientoService = {
  createRelevamiento: async (cui: number, createdBy: string) => {
    try {
      const response = await axios.post("/api/relevamientos", { cui, created_by: createdBy, });
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
  updateEstadoRelevamiento: async (id: number, estado: string) => {
    const response = await fetch(`/api/relevamientos/id/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado }), // <-- aquí usas el parámetro recibido
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el estado del local");
  }

  return await response.json();
  }
};
