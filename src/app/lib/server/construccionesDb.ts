"use server";

import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

interface Construccion extends RowDataPacket {
  id: number;
  relevamiento_id: number | null;
  numero_construccion: number | null;
  antiguedad: string | null;
  destino: string | null;
  superficie_cubierta: number | null;
  superficie_semicubierta: number | null;
  superficie_total: number | null;
  observaciones: string | null;
}

export const getConstruccionesByRelevamientoId = async (
  relevamientoId: number
): Promise<Construccion[]> => {
  const [rows] = await pool.execute<Construccion[]>(
    `SELECT * FROM construcciones WHERE relevamiento_id = ? ORDER BY
      numero_construccion ASC,
      id ASC`,
    [relevamientoId]
  );

  // connection.release(); // Eliminamos esta línea

  return rows;
};
