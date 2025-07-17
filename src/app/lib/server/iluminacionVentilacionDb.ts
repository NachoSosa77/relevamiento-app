// lib/server/iluminacionVentilacionDb.ts
"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

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
  localId: number
): Promise<IluminacionVentilacion[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<IluminacionVentilacion[]>(
    `SELECT * FROM iluminacion_ventilacion WHERE relevamiento_id = ?  AND local_id = ?`,
    [relevamientoId, localId]
  );

  connection.release();

  return rows;
};
