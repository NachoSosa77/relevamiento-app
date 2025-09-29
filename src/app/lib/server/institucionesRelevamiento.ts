"use server";
import { RowDataPacket } from "mysql2";
// Asegúrate de que la ruta a tu conexión a la base de datos sea correcta
import { pool } from "../db";

// --- Interfaz de Datos ---

/**
 * Define la estructura de los datos de la institución que se devolverán
 * para un relevamiento específico.
 */
export interface InstitucionPorRelevamiento extends RowDataPacket {
  id: number; // id de la tabla instituciones_por_relevamiento
  relevamiento_id: number;
  institucion_id: number;
  institucion: string; // Nombre de la institución
  cue: number; // Código Único de Establecimiento
  localidad: string;
  modalidad_nivel: string;
}

// --- Función del End Point ---

/**
 * Obtiene todas las instituciones asociadas a un ID de relevamiento.
 * @param relevamientoId El ID del relevamiento a consultar.
 * @returns Una promesa que resuelve con un array de InstitucionesPorRelevamiento.
 */
export const getInstitucionesRelacionadasByRelevamientoId = async (
  relevamientoId: number
): Promise<InstitucionPorRelevamiento[]> => {
  // Consulta SQL con JOIN y filtrado por relevamiento_id
  const sqlQuery = `
        SELECT 
            ipr.id, 
            ipr.relevamiento_id, 
            ipr.institucion_id,
            i.institucion, 
            i.cue, 
            i.localidad, 
            i.modalidad_nivel
        FROM 
            instituciones_por_relevamiento AS ipr
        JOIN 
            instituciones AS i 
        ON 
            ipr.institucion_id = i.id
        WHERE 
            ipr.relevamiento_id = ?
    `;

  // Ejecución de la consulta usando el pool
  const [rows] = await pool.query<InstitucionPorRelevamiento[]>(
    sqlQuery,
    [relevamientoId] // El '?' en la query se reemplaza por este valor
  );

  return rows;
};
