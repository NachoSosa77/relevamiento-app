"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

interface Visita extends RowDataPacket {
  id: number;
  numero_visita: number;
  fecha: string;
  hora_inicio: string;
  hora_finalizacion: string;
  observaciones: string;
  relevamiento_id: number;
}

export const getVisitasByRelevamientoIdServer = async (
  relevamientoId: number
): Promise<Visita[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<Visita[]>(
    `SELECT * FROM visitas_realizadas WHERE relevamiento_id = ?`,
    [relevamientoId]
  );

  connection.release();

  return rows;
};
