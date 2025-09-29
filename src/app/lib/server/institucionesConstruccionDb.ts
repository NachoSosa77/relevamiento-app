"use server";
import { RowDataPacket } from "mysql2";
import { pool } from "../db";

export interface InstitucionPorConstruccion extends RowDataPacket {
  id: number;
  construccion_id: number;
  institucion_id: number;
  relevamiento_id: number;
  institucion: string;
  cue: number;
  localidad: string;
  modalidad_nivel: string;
}

export const getInstitucionesPorConstruccion = async (
  relevamientoId: number,
  construccionId: number
): Promise<InstitucionPorConstruccion[]> => {
  const [rows] = await pool.query<InstitucionPorConstruccion[]>(
    `
    SELECT ipc.id, ipc.construccion_id, ipc.institucion_id, ipc.relevamiento_id,
           i.institucion, i.cue, i.localidad, i.modalidad_nivel
    FROM instituciones_por_construccion AS ipc
    JOIN instituciones AS i ON ipc.institucion_id = i.id
    WHERE ipc.relevamiento_id = ? AND ipc.construccion_id = ?
    `,
    [relevamientoId, construccionId]
  );

  return rows;
};
