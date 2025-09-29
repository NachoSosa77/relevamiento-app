// lib/server/iluminacionVentilacionDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { pool } from "../db";

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
  const [rows] = await pool.execute<IluminacionVentilacion[]>(
    `SELECT * FROM iluminacion_ventilacion WHERE relevamiento_id = ?  AND local_id = ?`,
    [relevamientoId, localId]
  );

  return rows;
};
