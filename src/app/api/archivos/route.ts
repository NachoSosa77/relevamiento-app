import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${extension}`;
    const absolutePath = path.join("/archivos", fileName);

    try {
      await writeFile(absolutePath, buffer);
      archivosSubidos.push({
        archivo_url: `/archivos/${fileName}`,
        tipo_archivo: file.type,
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
