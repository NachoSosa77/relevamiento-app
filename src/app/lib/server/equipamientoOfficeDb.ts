// lib/server/equipamientoCocinaOfficesDb.ts
"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

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
  const connection = await getConnection();

  const [rows] = await connection.execute<EquipamientoCocinaOffice[]>(
    `SELECT * FROM equipamiento_cocina_offices WHERE relevamiento_id = ? AND local_id = ?`,
    [relevamientoId, localId]
  );

  connection.release();

  return rows;
};
