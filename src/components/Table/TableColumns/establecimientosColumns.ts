import { InstitucionesData } from "@/interfaces/Instituciones";

const ESTABLECIMIENTOS_COLUMNS = [
  {
    Header: "Establecimiento",
    accessor: "institucion" as keyof InstitucionesData,
  },
  {
    Header: "Modalidad/Nivel",
    accessor: "modalidad_nivel" as keyof InstitucionesData,
  },
  { Header: "Calle", accessor: "calle" as keyof InstitucionesData },
  { Header: "Número", accessor: "numero" as keyof InstitucionesData },
  { Header: "Referencia", accessor: "referencia" as keyof InstitucionesData },
  { Header: "Provincia", accessor: "provincia" as keyof InstitucionesData },
  {
    Header: "Departamento",
    accessor: "departamento" as keyof InstitucionesData,
  },
  {
    Header: "Localidad/Paraje",
    accessor: "localidad" as keyof InstitucionesData,
  },
];

export default ESTABLECIMIENTOS_COLUMNS;
