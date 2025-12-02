// lib/server/localesPorConstruccionDb.ts
"use server";

import { pool } from "@/app/lib/db";
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
  const [rows] = await pool.execute<LocalPorConstruccion[]>(
    `SELECT * FROM locales_por_construccion WHERE relevamiento_id = ? AND construccion_id = ? ORDER BY
      CAST(identificacion_plano AS UNSIGNED) ASC,  
      identificacion_plano ASC,
      id ASC                        `,
    [relevamientoId, construccionId]
  );

  return rows;
};

export const getLocalById = async (
  localId: number
): Promise<LocalPorConstruccion | null> => {
  const [rows] = await pool.execute<LocalPorConstruccion[]>(
    `SELECT * FROM locales_por_construccion WHERE id = ?`,
    [localId]
  );

  return rows[0] || null;
};
