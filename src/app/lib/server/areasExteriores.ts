"use server";

import { RowDataPacket } from "mysql2";
import { pool } from "../db"; // asegúrate de que el path coincida

// --- Interfaz de Datos ---
export interface AreaExterior extends RowDataPacket {
  id: number;
  identificacion_plano: string | null;
  tipo: string | null;
  superficie: number | null;
  estado_conservacion: string | null;
  terminacion_piso: string | null;
  cui_number: number | null;
  relevamiento_id: number | null;
  predio_id: number | null;
}

// --- Función Principal ---

/**
 * Obtiene todas las áreas exteriores asociadas a un relevamiento y predio específicos.
 * @param relevamientoId ID del relevamiento.
 * @param predioId ID del predio.
 * @returns Un array de áreas exteriores.
 */
export const getAreasExterioresByRelevamiento = async (
  relevamientoId: number
): Promise<AreaExterior[]> => {
  const sqlQuery = `
    SELECT 
      id,
      identificacion_plano,
      tipo,
      superficie,
      estado_conservacion,
      terminacion_piso,
      cui_number,
      relevamiento_id,
      predio_id
    FROM areas_exteriores
    WHERE relevamiento_id = ? 
  `;

  const [rows] = await pool.query<AreaExterior[]>(sqlQuery, [relevamientoId]);

  return rows;
};
