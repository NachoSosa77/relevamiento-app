import { getConnection } from "@/app/lib/db";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

  // Ruta del sistema para guardar físicamente los archivos
  const archivosPath =
    process.env.ARCHIVOS_PATH || path.join(process.cwd(), "public", "archivos");

  // Nos aseguramos que la carpeta exista
  if (!existsSync(archivosPath)) {
    await mkdir(archivosPath, { recursive: true });
  }

  const domain = process.env.DOMINIO_PUBLICO || "http://localhost:3000";

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${extension}`;
    const absolutePath = path.join(archivosPath, fileName);

    try {
      // Guardar el archivo físicamente
      await writeFile(absolutePath, buffer);

      // URL pública servida por nginx
      const url = `${domain}/archivos/${fileName}`;
      const tipo_archivo = file.type.includes("pdf") ? "pdf" : "imagen";

      // Guardamos en la base de datos
      await connection.execute(
        `INSERT INTO archivos (relevamiento_id, archivo_url, tipo_archivo, fecha_subida)
         VALUES (?, ?, ?, NOW())`,
        [relevamientoId, url, tipo_archivo]
      );

      archivosSubidos.push({
        archivo_url: url,
        tipo_archivo,
        relevamiento_id: relevamientoId,
      });
    } catch (err) {
      console.error("Error al guardar archivo:", err);
      return NextResponse.json(
        { error: "Error al guardar uno de los archivos" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    archivos: archivosSubidos,
  });
}
