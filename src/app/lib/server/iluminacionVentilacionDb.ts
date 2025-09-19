// lib/server/iluminacionVentilacionDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface IluminacionVentilacion extends RowDataPacket {
  id: number;
  local_id: number | null;
  relevamiento_id: number | null;
  condicion: string | null;
  disponibilidad: string | null;
  superficie_iluminacion: number | null;
  superficie_ventilacion: number | null;
}

export const getIluminacionVentilacionByRelevamientoId = async (
  relevamientoId: number,
  localId: number,
  connection: PoolConnection
): Promise<IluminacionVentilacion[]> => {
  const [rows] = await connection.execute<IluminacionVentilacion[]>(
    `SELECT * FROM iluminacion_ventilacion WHERE relevamiento_id = ?  AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
