// lib/server/materialesPredominantesDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

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
  localId: number,
  connection: PoolConnection
): Promise<MaterialPredominante[]> => {
  const [rows] = await connection.execute<MaterialPredominante[]>(
    `SELECT * FROM materiales_predominantes WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
