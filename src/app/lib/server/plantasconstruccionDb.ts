"use server";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

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
  construccionId: number,
  connection: PoolConnection
): Promise<PlantasPorConstruccion[]> => {
  const [rows] = await connection.execute<PlantasPorConstruccion[]>(
    `SELECT * FROM plantas WHERE relevamiento_id = ? AND construccion_id = ?`,

    [relevamientoId, construccionId]
  );

  return rows;
};
