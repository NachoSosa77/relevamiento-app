// lib/server/equipamientoCocinaOfficesDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { pool } from "../db";

export interface EquipamientoCocinaOffice extends RowDataPacket {
  id: number;
  cantidad: number | null;
  cantidad_funcionamiento: number | null;
  estado: string | null;
  local_id: number | null;
  relevamiento_id: number | null;
  equipamiento: string | null;
}

export const getEquipamientoCocinaOfficesByRelevamientoId = async (
  relevamientoId: number,
  localId: number
): Promise<EquipamientoCocinaOffice[]> => {
  const [rows] = await pool.execute<EquipamientoCocinaOffice[]>(
    `SELECT * FROM equipamiento_cocina_offices WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
