import { getConnection } from "@/app/lib/db";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Convierte File a Buffer
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

  for (const file of files) {
    try {
      const fileBuffer = await fileToBuffer(file);
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, "-"); // formato seguro para nombres de archivo
      const uniqueName = `Planos/${timestamp}_${file.name}`;

      const blob = await put(uniqueName, fileBuffer, {
        access: "public", // o "private" si quieres proteger el acceso
        contentType: file.type,
      });

      const tipo_archivo = file.type.includes("pdf") ? "pdf" : "imagen";

      await connection.execute(
        `INSERT INTO archivos (relevamiento_id, archivo_url, tipo_archivo, fecha_subida)
         VALUES (?, ?, ?, NOW())`,
        [relevamientoId, blob.url, tipo_archivo]
      );

      archivosSubidos.push({
        archivo_url: blob.url,
        tipo_archivo,
        relevamiento_id: relevamientoId,
      });
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: "Error al subir uno de los archivos a Blob" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    archivos: archivosSubidos,
  });
}
