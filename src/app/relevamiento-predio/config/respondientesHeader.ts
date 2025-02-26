// Columnas de la tabla

import { Respondentes } from "@/interfaces/Respondientes";

interface RespondientesHeaderColumn {
  Header: string;
  accessor: keyof Respondentes;
  inputType: "number" | "date" | "time" | "text";
}

export const respondientesHeader: RespondientesHeaderColumn[] = [
  {
    Header: "Nombre y apellido",
    accessor: "nombreCompleto",
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
