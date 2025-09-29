// En /api/instalaciones_basicas

// Asegúrate de importar 'pool' directamente
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise"; // Keep for type hinting
import { NextRequest, NextResponse } from "next/server";

// Tipado del payload
interface InstalacionBasicaItem {
  servicio?: string;
  tipo_instalacion?: string;
  funciona?: string;
  motivo?: string;
  relevamiento_id: number;
  local_id: number;
}

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export async function POST(req: Request) {
  // Ya no necesitas 'connection: PoolConnection | undefined;' ni 'connection = await getConnection();'
  try {
    const data: InstalacionBasicaItem[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    const chunkSize = 100;
    const chunks = chunkArray(data, chunkSize);

    // 🔹 Insert secuencial por chunk
    for (const [index, chunk] of chunks.entries()) {
      const values = chunk.map((item) => [
        item.servicio ?? null,
        item.tipo_instalacion ?? null,
        item.funciona ?? null,
        item.motivo ?? null,
        item.relevamiento_id,
        item.local_id,
      ]);

      const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
      const flatValues = values.flat();

      const insertQuery = `
        INSERT INTO instalaciones_basicas
        (servicio, tipo_instalacion, funciona, motivo, relevamiento_id, local_id)
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE -- Agregado ON DUPLICATE KEY UPDATE, es CRÍTICO para POST si las claves ya existen
          servicio = VALUES(servicio),
          tipo_instalacion = VALUES(tipo_instalacion),
          funciona = VALUES(funciona),
          motivo = VALUES(motivo)
      `;
      // console.time(`Chunk ${index + 1}`); // Inicia el timer aquí si quieres medir cada chunk
      await pool.execute(insertQuery, flatValues); // <--- Usa pool.execute() directamente
      // console.timeEnd(`Chunk ${index + 1}`); // Finaliza el timer aquí
    }

    return NextResponse.json(
      { message: "Datos insertados/actualizados correctamente" }, // Mensaje actualizado
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "❌ Error al insertar/actualizar instalaciones_basicas:",
      error
    );
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al insertar/actualizar los datos", details },
      { status: 500 }
    );
  }
  // ¡El bloque finally para connection.release() ya no es necesario aquí!
}

export async function GET(req: NextRequest) {
  try {
    // Añadido try-catch para manejo consistente de errores
    const localId = Number(req.nextUrl.searchParams.get("localId"));
    const relevamientoId = Number(
      req.nextUrl.searchParams.get("relevamientoId")
    );

    if (!localId || !relevamientoId) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    // Ya no necesitas 'const connection = await getConnection();'
    // console.time("GET instalaciones_basicas"); // inicio medición
    const [rows] = await pool.execute<RowDataPacket[]>( // <--- Usa pool.execute() directamente
      `SELECT * FROM instalaciones_basicas WHERE local_id = ? AND relevamiento_id = ?`,
      [localId, relevamientoId]
    );
    // console.timeEnd("GET instalaciones_basicas"); // fin medición

    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("❌ Error al obtener instalaciones_basicas:", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al obtener los datos", details },
      { status: 500 }
    );
  }
  // ¡El bloque finally para connection.release() ya no es necesario aquí!
}

export async function PUT(req: Request) {
  // Ya no necesitas 'connection: PoolConnection | undefined;' ni 'connection = await getConnection();'
  try {
    const data: (InstalacionBasicaItem & { id: number })[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Payload debe ser un array no vacío" },
        { status: 400 }
      );
    }

    // 🔹 Optimizando el PUT: Usar Promise.all para ejecutar updates en paralelo (dentro del chunk)
    // También podríamos usar chunkArray aquí si el data array es muy grande y hay muchos ítems a actualizar.
    const updatePromises = data.map((item) => {
      if (!item.id) return Promise.resolve(null); // O manejar el error apropiadamente

      const updateQuery = `
        UPDATE instalaciones_basicas
        SET servicio = ?,
            tipo_instalacion = ?,
            funciona = ?,
            motivo = ?
        WHERE id = ? AND relevamiento_id = ? AND local_id = ?
      `;

      return pool.execute(updateQuery, [
        // <--- Usa pool.execute() directamente para cada item
        item.servicio ?? null,
        item.tipo_instalacion ?? null,
        item.funciona ?? null,
        item.motivo ?? null,
        item.id,
        item.relevamiento_id,
        item.local_id,
      ]);
    });

    await Promise.all(updatePromises); // Espera a que todas las actualizaciones se completen

    return NextResponse.json(
      { message: "Datos actualizados correctamente" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ Error al actualizar instalaciones_basicas:", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al actualizar los datos", details },
      { status: 500 }
    );
  }
  // ¡El bloque finally para connection.release() ya no es necesario aquí!
}
