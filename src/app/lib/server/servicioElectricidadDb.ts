// lib/server/servicioElectricidadDb.ts
"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export interface ServicioElectricidad extends RowDataPacket {
  id: number;
  servicio: string | null;
  estado: string | null;
  relevamiento_id: number | null;
  potencia: number | null;
  estado_bateria: string | null;
  tipo_combustible: string | null;
  disponibilidad: string | null;
  construccion_id: number | null;
}

export const getServicioElectricidadByRelevamientoId = async (
  relevamientoId: number
): Promise<ServicioElectricidad[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<ServicioElectricidad[]>(
    `SELECT * FROM servicio_electricidad WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId]
  );

  connection.release();

  return rows;
};
