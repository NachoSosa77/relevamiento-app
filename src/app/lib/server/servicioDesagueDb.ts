// lib/server/servicioDesagueDb.ts
"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export interface ServicioDesague extends RowDataPacket {
  id: number;
  servicio: string | null;
  estado: string | null;
  relevamiento_id: number | null;
  construccion_id: number | null;
}

export const getServicioDesagueByRelevamientoId = async (
  relevamientoId: number
): Promise<ServicioDesague[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<ServicioDesague[]>(
    `SELECT * FROM servicio_desague WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId]
  );

  connection.release();

  return rows;
};
