// lib/server/estadoConservacionDb.ts
"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export interface EstadoConservacion extends RowDataPacket {
  id: number;
  relevamiento_id: number;
  estructura: string;
  disponibilidad: string;
  estado: string;
  construccion_id: number;
}

export const getEstadoConservacionByRelevamientoId = async (
  relevamientoId: number,
  construccionId: number
): Promise<EstadoConservacion[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<EstadoConservacion[]>(
    `SELECT * FROM estado_conservacion WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  connection.release();

  return rows;
};
