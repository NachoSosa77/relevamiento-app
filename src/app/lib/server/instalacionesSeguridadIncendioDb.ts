// lib/server/instalacionesSeguridadIncendioDb.ts
"use server";

import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface InstalacionSeguridadIncendio extends RowDataPacket {
  id: number;
  servicio: string | null;
  disponibilidad: string | null;
  cantidad: number | null;
  carga_anual_matafuegos: string | null;
  simulacros_evacuacion: string | null;
  relevamiento_id: number | null;
  construccion_id: number | null;
}

export const getInstalacionesSeguridadIncendioByConstruccionId = async (
  relevamientoId: number,
  construccionId: number,
  connection: PoolConnection
): Promise<InstalacionSeguridadIncendio[]> => {
  const [rows] = await connection.execute<InstalacionSeguridadIncendio[]>(
    `SELECT * FROM instalaciones_seguridad_incendio WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  return rows;
};
