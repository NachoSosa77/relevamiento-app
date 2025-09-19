// lib/server/equipamientoSanitariosDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

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
  localId: number,
  connection: PoolConnection
): Promise<EquipamientoSanitario[]> => {
  const [rows] = await connection.execute<EquipamientoSanitario[]>(
    `SELECT * FROM equipamiento_sanitarios WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
