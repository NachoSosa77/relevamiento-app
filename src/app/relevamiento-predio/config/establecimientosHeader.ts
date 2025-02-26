import { InstitucionesData } from "@/interfaces/Instituciones";

interface EstablemicientosPredioHeaderColumn {
  Header: string;
  accessor: keyof InstitucionesData;
  inputType: "number" | "date" | "time" | "text";
}

export const establecimientosHeader: EstablemicientosPredioHeaderColumn[] = [
  {
    Header: "Denominación del establecimiento",
    accessor: "institucion",
    inputType: "text",
  },
  {
    Header: "CUE Anexo",
    accessor: "cue",
    inputType: "number",
  },
];
