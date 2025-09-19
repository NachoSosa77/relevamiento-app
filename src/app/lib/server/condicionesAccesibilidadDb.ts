// lib/server/condicionesAccesibilidadDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface CondicionAccesibilidad extends RowDataPacket {
  id: number;
  servicio: string | null;
  disponibilidad: string | null;
  cantidad: number | null;
  estado: string | null;
  mantenimiento: string | null;
  relevamiento_id: number | null;
  construccion_id: number | null;
}

export const getCondicionesAccesibilidadByConstruccionId = async (
  relevamientoId: number,
  construccionId: number,
  connection: PoolConnection
): Promise<CondicionAccesibilidad[]> => {
  const [rows] = await connection.execute<CondicionAccesibilidad[]>(
    `SELECT * FROM condiciones_accesibilidad WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  return rows;
};
