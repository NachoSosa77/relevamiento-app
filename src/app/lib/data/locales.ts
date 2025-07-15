import { getConnection } from "@/app/lib/db";
import { LocalesConstruccion } from "@/interfaces/Locales"; // asegurate de importar el tipo
import { RowDataPacket } from "mysql2";

export async function getLocalesPorRelevamiento(
  relevamientoId: number
): Promise<LocalesConstruccion[]> {
  const connection = await getConnection();

  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT * FROM locales_construccion WHERE relevamiento_id = ?`,
    [relevamientoId]
  );

  connection.release();

  return rows as LocalesConstruccion[];
}
