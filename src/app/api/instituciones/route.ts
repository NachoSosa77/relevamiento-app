/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConnection } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Institucion extends RowDataPacket {
  departamento: string;
  localidad: string;
  modalidad_nivel: string;
  institucion: string;
  cui: string;
  matricula: number;
  calle: string;
  calle_numero: string;
  referencia: string;
  provincia: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cui = searchParams.get("cui");
  try {
    const connection = await getConnection();
    let query = "SELECT * FROM instituciones";
    const values: string[] = [];

    if (cui) {
      query += " WHERE cui = ?";
      values.push(cui);
    }

    const [instituciones] = await connection.query<Institucion[]>(
      query,
      values
    );
    connection.release();

    if (cui && instituciones.length === 0) {
      return NextResponse.json(
        { message: "Establecimiento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ instituciones });
  } catch (err: any) {
    console.error("Error al obtener las instituciones:", err);
    return NextResponse.json(
      { message: "Error al obtener las instituciones", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const connection = await getConnection();
    const data = await req.json();
    const {
      departamento,
      localidad,
      modalidad_nivel,
      institucion,
      cui,
      matricula,
      calle,
      calle_numero,
      referencia,
      provincia,
    } = data;

    await connection.query(
      "INSERT INTO instituciones (departamento, localidad, modalidad_nivel, institucion, cui, matricula, calle, calle_numero, referencia, provincia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        departamento,
        localidad,
        modalidad_nivel,
        institucion,
        cui,
        matricula,
        calle,
        calle_numero,
        referencia,
        provincia,
      ]
    );
    connection.release();

    return NextResponse.json(
      { message: "Establecimiento insertado correctamente" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error al insertar establecimiento:", err);
    return NextResponse.json(
      { message: "Error al insertar establecimiento", error: err.message },
      { status: 500 }
    );
  }
}
