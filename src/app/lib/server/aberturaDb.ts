// lib/server/aberturasDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface Abertura extends RowDataPacket {
  id: number;
  local_id: number | null;
  relevamiento_id: number | null;
  abertura: string | null;
  tipo: string | null;
  cantidad: number | null;
  estado: string | null;
}

export const getAberturasByRelevamientoIdAndLocalId = async (
  relevamientoId: number,
  localId: number,
  connection: PoolConnection
): Promise<Abertura[]> => {
  const [rows] = await connection.execute<Abertura[]>(
    `SELECT * FROM aberturas WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
