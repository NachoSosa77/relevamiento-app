// lib/server/aberturasDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { pool } from "../db";

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
  localId: number
): Promise<Abertura[]> => {
  const [rows] = await pool.execute<Abertura[]>(
    `SELECT * FROM aberturas WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
