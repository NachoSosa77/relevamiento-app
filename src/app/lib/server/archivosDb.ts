"use server";

import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

interface Archivo extends RowDataPacket {
  id: number;
  relevamiento_id: number | null;
  archivo_url: string | null;
  tipo_archivo: string | null;
  fecha_subida: string | null; // timestamp en string
}

export const getArchivosByRelevamientoId = async (
  relevamientoId: number
): Promise<Archivo[]> => {
  const [rows] = await pool.execute<Archivo[]>(
    `SELECT * FROM archivos WHERE relevamiento_id = ?`,
    [relevamientoId]
  );

  // connection.release(); // Eliminamos esta línea

  return rows;
};
