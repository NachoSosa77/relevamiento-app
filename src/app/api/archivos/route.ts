/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

function fileToBuffer(file: File): Promise<Buffer> {
  return file.arrayBuffer().then((ab) => Buffer.from(ab));
}

export async function POST(req: Request) {
  const connection = await getConnection();

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const relevamientoId = formData.get("relevamientoId");

  if (!files.length || !relevamientoId) {
    return NextResponse.json(
      { error: "Archivos o relevamientoId faltantes" },
      { status: 400 }
    );
  }

  const archivosSubidos = [];
  const errores: { nombre: string; mensaje: string }[] = [];

  for (const file of files) {
    try {
      const fileBuffer = await fileToBuffer(file);

      // usar directamente el nombre original
      const uniqueName = file.name;

      const blob = await put(uniqueName, fileBuffer, {
        access: "public",
        contentType: file.type,
      });

      const tipo_archivo = file.type.includes("pdf") ? "pdf" : "imagen";

      await connection.execute(
        `INSERT INTO archivos (relevamiento_id, archivo_url, tipo_archivo, nombre_archivo, fecha_subida)
         VALUES (?, ?, ?, ?, NOW())`,
        [relevamientoId, blob.url, tipo_archivo, file.name]
      );

      archivosSubidos.push({
        archivo_url: blob.url,
        tipo_archivo,
        relevamiento_id: relevamientoId,
        nombre_archivo: file.name, // 👈 importante devolverlo también
      });
    } catch (err: any) {
      console.error(`❌ Error al subir archivo ${file.name}:`, err);
      errores.push({
        nombre: file.name,
        mensaje: err.message || "Error desconocido",
      });
      continue;
    }
  }

  return NextResponse.json({
    success: true,
    archivos: archivosSubidos,
    errores,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const relevamientoId = searchParams.get("relevamientoId");

  if (!relevamientoId) {
    return NextResponse.json(
      { error: "Falta relevamientoId" },
      { status: 400 }
    );
  }

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT archivo_url, tipo_archivo, nombre_archivo 
       FROM archivos 
       WHERE relevamiento_id = ?`,
      [relevamientoId]
    );

    return NextResponse.json({ archivos: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error al obtener archivos" },
      { status: 500 }
    );
  }
}
