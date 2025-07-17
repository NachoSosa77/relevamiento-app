// lib/server/localesPorConstruccionDb.ts
"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

interface LocalPorConstruccion extends RowDataPacket {
  id: number;
  relevamiento_id: number;
  construccion_id: number;
  identificacion_plano: string | null;
  numero_planta: number | null;
  tipo: string | null;
  superficie: number | null;
  observaciones: string | null;
  estado: "incompleto" | "completo";
  numero_construccion: string | null;
}

export const getLocalesByConstruccionAndRelevamiento = async (
  relevamientoId: number,
  construccionId: number
): Promise<LocalPorConstruccion[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<LocalPorConstruccion[]>(
    `SELECT * FROM locales_por_construccion WHERE relevamiento_id = ? AND construccion_id = ?`,
    [relevamientoId, construccionId]
  );

  connection.release();
  return rows;
};
