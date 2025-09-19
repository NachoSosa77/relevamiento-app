// lib/server/instalacionesBasicasDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface InstalacionBasica extends RowDataPacket {
  id: number;
  servicio: string | null;
  tipo_instalacion: string | null;
  funciona: string | null;
  motivo: string | null;
  relevamiento_id: number | null;
  local_id: number | null;
}

export const getInstalacionesBasicasByRelevamientoId = async (
  relevamientoId: number,
  localId: number,
  connection: PoolConnection
): Promise<InstalacionBasica[]> => {
  const [rows] = await connection.execute<InstalacionBasica[]>(
    `SELECT * FROM instalaciones_basicas WHERE relevamiento_id = ?  AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
