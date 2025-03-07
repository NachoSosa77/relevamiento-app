import { Plantas } from "@/interfaces/Plantas";

// Columnas de la tabla
export interface Column {
  header: string;
  key: keyof Plantas;
  type: "number";
}

export const plantasHeader: Column[] = [
  { header: "Subsuelos", key: "subsuelo", type: "number" },
  { header: "PB", key: "pb", type: "number" },
  { header: "Pisos Superiores", key: "pisos_superiores", type: "number" },
  { header: "Total", key: "total_plantas", type: "number" }, // Nueva columna
];
