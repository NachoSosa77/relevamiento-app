import { Column } from "@/interfaces/AreaExterior";

export const areasExterioresColumns: Column[] = [
  { header: "", key: "id", type: "text" },
  {
    header: "N° de identificación en el plano",
    key: "identificacion_plano",
    type: "text",
  },
  {
    header: "Tipo de área",
    key: "tipo",
    type: "text",
  },
  {
    header: "Terminación del piso",
    key: "terminacion_piso",
    type: "select",
    options: ["Sí", "No"],
  },
  {
    header: "Estado de conservación",
    key: "estado_conservacion",
    type: "select",
    options: ["Bueno", "Malo", "Regular"],
  },
];
