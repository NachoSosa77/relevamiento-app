// lib/server/servicioGasDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface ServicioGas extends RowDataPacket {
  id: number;
  servicio: string | null;
  estado: string | null;
  relevamiento_id: number | null;
  construccion_id: number | null;
}

export const getServicioGasByRelevamientoId = async (
  relevamientoId: number,
  construccionId: number,
  connection: PoolConnection
): Promise<ServicioGas[]> => {
  const [rows] = await connection.execute<ServicioGas[]>(
    `SELECT * FROM servicio_gas WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  return rows;
};
