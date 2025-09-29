// lib/server/acondicionamientoTermicoDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { pool } from "../db";

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
  localId: number
): Promise<AcondicionamientoTermico[]> => {
  const [rows] = await pool.execute<AcondicionamientoTermico[]>(
    `SELECT * FROM acondicionamiento_termico WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
