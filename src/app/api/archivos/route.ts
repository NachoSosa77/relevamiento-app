import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

// ✅ Esta función convierte File (de formData) a Buffer para poder usarlo correctamente
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
  const uploadServerUrl =
    process.env.EXTERNAL_UPLOAD_URL || "https://vps-4706926-x.dattaweb.com";

  for (const file of files) {
    try {
      const fileBuffer = await fileToBuffer(file);

      const fileFormData = new FormData();
      fileFormData.append(
        "files",
        new Blob([fileBuffer], { type: file.type }),
        file.name
      );
      fileFormData.append("relevamientoId", String(relevamientoId));

      const uploadResponse = await fetch(uploadServerUrl, {
        method: "POST",
        body: fileFormData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(
          `Error al subir archivo al servidor externo: ${errorText}`
        );
      }

      const responseJson = await uploadResponse.json();
      const archivosInfo = Array.isArray(responseJson)
        ? responseJson
        : [responseJson];

      for (const { url, tipo_archivo } of archivosInfo) {
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
      }
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: "Error al subir uno de los archivos" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    archivos: archivosSubidos,
  });
}
