interface EstablemicientosPredioHeaderColumn {
  Header: string;
  accessor: string | number;
  inputType: "number" | "text";
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
