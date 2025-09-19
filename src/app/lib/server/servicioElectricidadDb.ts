// lib/server/servicioElectricidadDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

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
  relevamientoId: number,
  construccionId: number,
  connection: PoolConnection
): Promise<ServicioElectricidad[]> => {
  const [rows] = await connection.execute<ServicioElectricidad[]>(
    `SELECT * FROM servicio_electricidad WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  return rows;
};
