// lib/server/acondicionamientoTermicoDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface AcondicionamientoTermico extends RowDataPacket {
  id: number;
  relevamiento_id: number | null;
  local_id: number | null;
  temperatura: string | null;
  tipo: string | null;
  cantidad: number | null;
  disponibilidad: string | null;
}

export const getAcondicionamientoTermicoByRelevamientoId = async (
  relevamientoId: number,
  localId: number,
  connection: PoolConnection
): Promise<AcondicionamientoTermico[]> => {
  const [rows] = await connection.execute<AcondicionamientoTermico[]>(
    `SELECT * FROM acondicionamiento_termico WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
