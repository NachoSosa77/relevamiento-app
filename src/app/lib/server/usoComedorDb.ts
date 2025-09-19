/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface ServicioComedor extends RowDataPacket {
  id: number;
  servicio: string | null;
  disponibilidad: string | null;
  tipos_comedor: any; // Usar un tipo más específico si sabés la estructura del JSON
  relevamiento_id: number | null;
  construccion_id: number | null;
}

export const getUsoComedorByRelevamientoId = async (
  relevamientoId: number,
  construccionId: number,
  connection: PoolConnection
): Promise<ServicioComedor[]> => {
  const [rows] = await connection.execute<ServicioComedor[]>(
    `
    SELECT 
      id,
      servicio,
      disponibilidad,
      tipos_comedor,
      relevamiento_id,
      construccion_id
    FROM uso_comedor
    WHERE relevamiento_id = ? AND construccion_id = ?
    `,
    [relevamientoId, construccionId]
  );

  // Parsear el campo JSON 'tipos_comedor'
  const parsedRows = rows.map((row) => ({
    ...row,
    tipos_comedor:
      typeof row.tipos_comedor === "string"
        ? JSON.parse(row.tipos_comedor)
        : row.tipos_comedor,
  }));

  return parsedRows;
};
