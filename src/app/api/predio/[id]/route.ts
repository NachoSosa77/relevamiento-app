import { pool } from "@/app/lib/db";
import type { ResultSetHeader } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

type PatchBody = Partial<{
  situacion: string | null;
  otra_situacion: string | null;
  situacion_juicio: string | null;
  observaciones: string | null;
  edificio_no_escolar_privado: string | number | boolean | null;
}>;

export async function PATCH(
  req: NextRequest,
  // 👇 mantenemos Promise por el bug de Next, pero convertimos a number
  { params }: { params: Promise<{ id: string }> }
) {
  const idStr = (await params).id;
  const id = Number(idStr);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const bodyUnknown: unknown = await req.json();
    if (typeof bodyUnknown !== "object" || bodyUnknown === null) {
      return NextResponse.json({ message: "Body inválido" }, { status: 400 });
    }
    const body = bodyUnknown as PatchBody;

    const fields: string[] = [];
    const values: (string | number | null | boolean)[] = [];

    if ("situacion" in body) {
      fields.push("situacion = ?");
      values.push(body.situacion ?? null);
    }
    if ("otra_situacion" in body) {
      fields.push("otra_situacion = ?");
      values.push(body.otra_situacion ?? null);
    }
    if ("situacion_juicio" in body) {
      fields.push("situacion_juicio = ?");
      values.push(body.situacion_juicio ?? null);
    }
    if ("observaciones" in body) {
      fields.push("observaciones = ?");
      values.push(body.observaciones ?? null);
    }
    if ("edificio_no_escolar_privado" in body) {
      fields.push("edificio_no_escolar_privado = ?");
      // admite string | number | boolean | null
      values.push(
        body.edificio_no_escolar_privado === undefined
          ? null
          : (body.edificio_no_escolar_privado as
              | string
              | number
              | boolean
              | null)
      );
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { message: "No hay campos para actualizar" },
        { status: 400 }
      );
    }

    const sql = `UPDATE predio SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.execute<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ updated: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error actualizando predio:", error);
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      { message: "Error actualizando predio", error: message },
      { status: 500 }
    );
  }
}
