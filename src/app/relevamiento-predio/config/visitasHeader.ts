import { Visita } from "@/interfaces/Visitas";

// Columnas de la tabla
interface VisitasHeaderColumn {
  Header: string;
  accessor: keyof Visita;
  inputType: "number" | "date" | "time" | "text";
}

export const visitasHeader: VisitasHeaderColumn[] = [
  { Header: "N° visita", accessor: "numero_visita", inputType: "number" },
  { Header: "Fecha", accessor: "fecha", inputType: "date" },
  { Header: "Hora inicio", accessor: "hora_inicio", inputType: "time" },
  {
    Header: "Hora finalización",
    accessor: "hora_finalizacion",
    inputType: "time",
  },
  { Header: "Obervaciones", accessor: "observaciones", inputType: "text" },
];
