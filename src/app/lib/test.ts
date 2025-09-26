// test-db.ts

import { pool } from "./db";

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    console.log("Conexión exitosa:", rows);
    process.exit(0);
  } catch (err) {
    console.error("Error conectando a la base:", err);
    process.exit(1);
  }
}

testConnection();
