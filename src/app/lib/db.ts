// lib/db.ts
import mysql from "mysql2/promise";
import { dbHost, dbName, dbPassword, dbUser } from "./config";

export const pool = mysql.createPool({
  host: dbHost,
  port: Number(process.env.DB_PORT) || 3306,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 5, // Ajustado para un mejor comportamiento serverless
  queueLimit: 0,
  connectTimeout: 5000, // 5 segundos: Falla más rápido si la DB no responde
});

// Función legacy para obtener conexión individual
export async function getConnection() {
  return pool.getConnection();
}
