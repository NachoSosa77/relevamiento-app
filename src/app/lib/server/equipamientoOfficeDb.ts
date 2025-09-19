// lib/server/equipamientoCocinaOfficesDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

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
  localId: number,
  connection: PoolConnection
): Promise<EquipamientoCocinaOffice[]> => {
  const [rows] = await connection.execute<EquipamientoCocinaOffice[]>(
    `SELECT * FROM equipamiento_cocina_offices WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
