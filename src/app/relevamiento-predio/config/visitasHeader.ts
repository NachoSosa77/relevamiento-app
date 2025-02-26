import { Visitas } from "@/interfaces/Visitas";

// Columnas de la tabla
interface VisitasHeaderColumn {
  Header: string;
  accessor: keyof Visitas;
  inputType: "number" | "date" | "time" | "text";
}

export const visitasHeader: VisitasHeaderColumn[] = [
  { Header: "N° visita", accessor: "id", inputType: "number" },
  { Header: "Fecha", accessor: "fecha", inputType: "date" },
  { Header: "Hora inicio", accessor: "horaInicio", inputType: "time" },
  { Header: "Hora finalización", accessor: "horaFin", inputType: "time" },
  { Header: "Obervaciones", accessor: "observaciones", inputType: "text" },
];
