// lib/db.ts
import mysql from "mysql2/promise";
import { dbHost, dbName, dbPassword, dbUser } from "./config";

export const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10, // ajustable según carga
  queueLimit: 0,
  connectTimeout: 15000, // 15 segundos
});

// Función legacy para obtener conexión individual
export async function getConnection() {
  return pool.getConnection();
}
