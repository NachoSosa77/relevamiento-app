/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "@/app/lib/db";
import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";

function fileToBuffer(file: File): Promise<Buffer> {
  return file.arrayBuffer().then((ab) => Buffer.from(ab));
}

export async function POST(req: Request) {
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

      // 👇 nombre único = relevamientoId + "_" + nombre original
      const uniqueName = `${relevamientoId}_${file.name}`;

      const blob = await put(uniqueName, fileBuffer, {
        access: "public",
        contentType: file.type,
      });

      const tipo_archivo = file.type.includes("pdf") ? "pdf" : "imagen";

      await pool.execute(
        `INSERT INTO archivos (relevamiento_id, archivo_url, tipo_archivo, nombre_archivo, fecha_subida)
         VALUES (?, ?, ?, ?, NOW())`,
        [relevamientoId, blob.url, tipo_archivo, file.name] // 👈 acá guardamos solo el nombre original
      );

      archivosSubidos.push({
        archivo_url: blob.url,
        tipo_archivo,
        relevamiento_id: relevamientoId,
        nombre_archivo: file.name, // mostramos el original
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
    const [rows] = await pool.execute(
      `SELECT id, archivo_url, tipo_archivo, nombre_archivo 
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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Falta el parámetro id" },
        { status: 400 }
      );
    }

    // 1. Buscar archivo en la base
    const [rows]: any = await pool.execute(
      "SELECT archivo_url FROM archivos WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "Archivo no encontrado" },
        { status: 404 }
      );
    }

    const archivoUrl = rows[0].archivo_url;

    // 2. Borrar de Vercel Blob
    await del(archivoUrl);

    // 3. Borrar de la base de datos
    await pool.execute("DELETE FROM archivos WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Error al borrar archivo:", err);
    return NextResponse.json(
      { error: err.message || "Error al borrar archivo" },
      { status: 500 }
    );
  }
}
