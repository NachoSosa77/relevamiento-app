// Columnas de la tabla

import { Respondiente } from "@/interfaces/Respondientes";

interface RespondientesHeaderColumn {
  Header: string;
  accessor: keyof Respondiente;
  inputType: "number" | "date" | "time" | "text";
}

export const respondientesHeader: RespondientesHeaderColumn[] = [
  {
    Header: "Nombre y apellido",
    accessor: "nombre_completo",
    inputType: "text",
  },
  { Header: "Cargo", accessor: "cargo", inputType: "text" },
  {
    Header: "Denominación del establecimiento educativo",
    accessor: "establecimiento",
    inputType: "text",
  },
  { Header: "Teléfono de contacto", accessor: "telefono", inputType: "text" },
];
