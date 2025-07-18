"use server";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export interface PlantasPorConstruccion extends RowDataPacket {
  id: number;
  construccion_id: number;
  relevamiento_id: number;
  subsuelo: number;
  pb: number;
  pisos_superiores: number;
  total_plantas: number;
}

export const getPlantasPorConstruccion = async (
  relevamientoId: number,
  construccionId: number
): Promise<PlantasPorConstruccion[]> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<PlantasPorConstruccion[]>(
    `SELECT * FROM plantas WHERE relevamiento_id = ? AND construccion_id = ?`,

    [relevamientoId, construccionId]
  );

  connection.release();
  return rows;
};
