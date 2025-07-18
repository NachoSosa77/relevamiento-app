// lib/server/servicioGasDb.ts
"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export interface ServicioGas extends RowDataPacket {
  id: number;
  servicio: string | null;
  estado: string | null;
  relevamiento_id: number | null;
  construccion_id: number | null;
}

export const getServicioGasByRelevamientoId = async (
  relevamientoId: number,
  construccionId: number
): Promise<ServicioGas[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<ServicioGas[]>(
    `SELECT * FROM servicio_gas WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  connection.release();

  return rows;
};
