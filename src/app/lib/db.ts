// lib/db.ts
import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { dbHost, dbName, dbPassword, dbUser } from "./config";

let pool: Pool | null = null;

async function getPool(): Promise<Pool> {
  if (!pool) {
    pool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    try {
      const connection = await pool.getConnection();
      console.log("Conexión a la base de datos establecida correctamente");
      connection.release();
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
    }
  }
  return pool;
}

export async function query<T>(sql: string, values: any[] = []): Promise<T[]> {
  const pool = await getPool();
  let connection: PoolConnection | undefined;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query<T[]>(sql, values);
    return rows;
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}
