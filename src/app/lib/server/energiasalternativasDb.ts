// lib/server/energiasAlternativasDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface EnergiaAlternativa extends RowDataPacket {
  id: number;
  tipo: string | null;
  disponibilidad: string | null;
  relevamiento_id: number | null;
  construccion_id: number | null;
}

export const getEnergiasAlternativasByConstruccionId = async (
  relevamientoId: number,
  construccionId: number,
  connection: PoolConnection
): Promise<EnergiaAlternativa[]> => {
  const [rows] = await connection.execute<EnergiaAlternativa[]>(
    `SELECT * FROM energias_alternativas WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  return rows;
};
