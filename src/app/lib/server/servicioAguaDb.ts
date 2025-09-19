/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/server/servicioAguaDb.ts
"use server";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface ServicioAgua extends RowDataPacket {
  id: number;
  tipo_provision: any;
  tipo_provision_estado: any;
  tipo_almacenamiento: any;
  tipo_almacenamiento_estado: any;
  alcance: any;
  tratamiento: string | null;
  tipo_tratamiento: string | null;
  control_sanitario: string | null;
  cantidad_veces: string | null;
  relevamiento_id: number;
  construccion_id: number;
}

export const getServicioAguaByRelevamientoId = async (
  relevamientoId: number,
  construccionId: number,
  connection: PoolConnection
): Promise<ServicioAgua[]> => {
  const [rows] = await connection.execute<ServicioAgua[]>(
    `SELECT * FROM servicio_agua WHERE relevamiento_id = ?  AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );
  return rows;
};
