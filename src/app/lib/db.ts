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
  connectionLimit: 10, // Ajustado para un mejor comportamiento serverless
  queueLimit: 0,
  connectTimeout: 10000, // 🔧 10 segundos más razonable
  maxIdle: 2, // 🔧 Agrega esto: cierra conexiones idle
  idleTimeout: 60000, // 🔧 1 minuto
  enableKeepAlive: true, // 🔧 Mantiene conexión viva
  keepAliveInitialDelay: 0,
});

// Función legacy para obtener conexión individual
export async function getConnection() {
  return pool.getConnection();
}
