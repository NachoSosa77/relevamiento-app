// lib/server/materialesPredominantesDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { pool } from "../db";

export interface MaterialPredominante extends RowDataPacket {
  id: number;
  item: string | null;
  material: string | null;
  estado: string | null;
  local_id: number | null;
  relevamiento_id: number | null;
}

export const getMaterialesPredominantesByRelevamientoId = async (
  relevamientoId: number,
  localId: number
): Promise<MaterialPredominante[]> => {
  const [rows] = await pool.execute<MaterialPredominante[]>(
    `SELECT * FROM materiales_predominantes WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
