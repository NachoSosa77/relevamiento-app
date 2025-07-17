// lib/server/instalacionesBasicasDb.ts
"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export interface InstalacionBasica extends RowDataPacket {
  id: number;
  servicio: string | null;
  tipo_instalacion: string | null;
  funciona: string | null;
  motivo: string | null;
  relevamiento_id: number | null;
  local_id: number | null;
}

export const getInstalacionesBasicasByRelevamientoId = async (
  relevamientoId: number,
  localId: number
): Promise<InstalacionBasica[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<InstalacionBasica[]>(
    `SELECT * FROM instalaciones_basicas WHERE relevamiento_id = ?  AND local_id = ?`,
    [relevamientoId, localId]
  );

  connection.release();

  return rows;
};
