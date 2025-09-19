// lib/server/servicioDesagueDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface ServicioDesague extends RowDataPacket {
  id: number;
  servicio: string | null;
  estado: string | null;
  relevamiento_id: number | null;
  construccion_id: number | null;
}

export const getServicioDesagueByRelevamientoId = async (
  relevamientoId: number,
  construccionId: number,
  connection: PoolConnection
): Promise<ServicioDesague[]> => {
  const [rows] = await connection.execute<ServicioDesague[]>(
    `SELECT * FROM servicio_desague WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  return rows;
};
