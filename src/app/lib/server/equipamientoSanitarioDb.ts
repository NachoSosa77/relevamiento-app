// lib/server/equipamientoSanitariosDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { pool } from "../db";

export interface EquipamientoSanitario extends RowDataPacket {
  id: number;
  cantidad: number | null;
  cantidad_funcionamiento: number | null;
  estado: string | null;
  local_id: number | null;
  relevamiento_id: number | null;
  equipamiento: string | null;
}

export const getEquipamientoSanitariosByRelevamientoId = async (
  relevamientoId: number,
  localId: number
): Promise<EquipamientoSanitario[]> => {
  const [rows] = await pool.execute<EquipamientoSanitario[]>(
    `SELECT * FROM equipamiento_sanitarios WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
