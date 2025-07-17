"use server";

import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

interface Relevamiento extends RowDataPacket {
  id: number;
  created_at: string;
  update_at: string;
  created_by: string | null;
  cui_id: number | null;
  estado: "incompleto" | "completo" | "cancelado";
  usuario_id: number | null;
  email: string | null;
}

export const getRelevamientoByIdServer = async (
  id: number
): Promise<Relevamiento | null> => {
  const connection = await getConnection();

  const [rows] = await connection.execute<Relevamiento[]>(
    `SELECT * FROM relevamientos WHERE id = ?`,
    [id]
  );

  connection.release();

  return rows.length > 0 ? rows[0] : null;
};
