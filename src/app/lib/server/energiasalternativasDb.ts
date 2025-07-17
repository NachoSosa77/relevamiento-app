// lib/server/energiasAlternativasDb.ts
"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export interface EnergiaAlternativa extends RowDataPacket {
  id: number;
  tipo: string | null;
  disponibilidad: string | null;
  relevamiento_id: number | null;
  construccion_id: number | null;
}

export const getEnergiasAlternativasByConstruccionId = async (
  relevamientoId: number,
  construccionId: number
): Promise<EnergiaAlternativa[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<EnergiaAlternativa[]>(
    `SELECT * FROM energias_alternativas WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  connection.release();

  return rows;
};
