"use server";

// 🔹 MODIFICACIÓN CLAVE: Importamos 'pool' en lugar de 'getConnection'
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise"; // Actualizado a mysql2/promise

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
  // 🔹 Eliminamos const connection = await getConnection();

  const [rows] = await pool.execute<Relevamiento[]>( // 🔹 USAMOS pool.execute() directamente
    `SELECT * FROM relevamientos WHERE id = ?`,
    [id]
  );

  // 🔹 Eliminamos connection.release();

  // Aseguramos que el resultado sea del tipo Relevamiento esperado
  return rows.length > 0 ? rows[0] : null;
};
