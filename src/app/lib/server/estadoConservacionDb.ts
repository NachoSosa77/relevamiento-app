// lib/server/estadoConservacionDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

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
  construccionId: number,
  connection: PoolConnection
): Promise<EstadoConservacion[]> => {
  const [rows] = await connection.execute<EstadoConservacion[]>(
    `SELECT * FROM estado_conservacion WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  return rows;
};
