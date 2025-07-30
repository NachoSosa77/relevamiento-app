// lib/server/energiasAlternativasDb.ts
"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export interface EspacioEscolar extends RowDataPacket {
  id: number;
  cantidad_construcciones: number | null;
  superficie_total_predio: number | null;
  observaciones: string | null;
  cui: number | null;
  relevamiento_id: number;
  predio_id: number | null;
}

export const getEspaciosEscolaresByRelevamientonId = async (
  relevamientoId: number
): Promise<EspacioEscolar[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<EspacioEscolar[]>(
    `SELECT * FROM espacios_escolares WHERE relevamiento_id = ?`,
    [relevamientoId]
  );

  connection.release();

  return rows;
};
