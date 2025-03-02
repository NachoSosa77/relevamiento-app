// lib/db.ts
import mysql from "mysql2/promise";
import { dbHost, dbName, dbPassword, dbUser } from "./config";

const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function getConnection() {
  return pool.getConnection();
}
