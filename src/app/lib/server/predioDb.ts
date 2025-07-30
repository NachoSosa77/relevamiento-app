"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

interface Predio extends RowDataPacket {
  id: number;
  relevamiento_id: number | null;
  edificio_no_escolar_privado: string | null;
  situacion: string | null;
  situacion_juicio: string | null;
  otra_situacion: string | null;
  observaciones: string | null;
}

export const getPrediosByRelevamientoId = async (
  relevamientoId: number
): Promise<Predio[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<Predio[]>(
    `SELECT * FROM predio WHERE relevamiento_id = ?`,
    [relevamientoId]
  );

  connection.release();

  return rows;
};
