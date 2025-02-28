// pages/api/instituciones.ts
import { RowDataPacket } from "mysql2";
import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../lib/db";

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

type Data = {
  message?: string;
  error?: string;
  instituciones?: Institucion[];
  institucion?: Institucion[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    if (req.query.cui) {
      await getInstitucionByCUI(req, res);
    } else {
      await getInstituciones(req, res);
    }
  } else if (req.method === "POST") {
    await createInstitucion(req, res);
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}

async function getInstituciones(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const instituciones = await query<Institucion>(
      "SELECT * FROM instituciones"
    );
    res.json({ instituciones });
  } catch (err) {
    console.error("Error al obtener las instituciones:", err);
    res.status(500).json({
      message: "Error al obtener las instituciones",
      error: err.message,
    });
  }
}

async function getInstitucionByCUI(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cui = req.query.cui as string;
  try {
    const instituciones = await query<Institucion>(
      "SELECT * FROM instituciones WHERE cui = ?",
      [cui]
    );

    if (instituciones.length > 0) {
      res.json({ institucion: instituciones });
    } else {
      res.status(404).json({ message: "Establecimiento no encontrado" });
    }
  } catch (err) {
    console.error("Error al obtener establecimiento por CUE:", err);
    res.status(500).json({
      message: "Error al obtener establecimiento por CUE",
      error: err.message,
    });
  }
}

async function createInstitucion(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
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
  } = req.body;
  try {
    await query(
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
    res
      .status(201)
      .json({ message: "Establecimiento insertado correctamente" });
  } catch (err) {
    console.error("Error al insertar establecimiento:", err);
    res.status(500).json({
      message: "Error al insertar establecimiento",
      error: err.message,
    });
  }
}
