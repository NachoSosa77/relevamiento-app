"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

interface Respondiente extends RowDataPacket {
  id: number;
  nombre_completo: string | null;
  cargo: string | null;
  establecimiento: string | null;
  telefono: string | null;
  relevamiento_id: number | null;
}

export const getRespondientesByRelevamientoId = async (
  relevamientoId: number
): Promise<Respondiente[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<Respondiente[]>(
    `SELECT * FROM respondientes WHERE relevamiento_id = ?`,
    [relevamientoId]
  );

  connection.release();

  return rows;
};
