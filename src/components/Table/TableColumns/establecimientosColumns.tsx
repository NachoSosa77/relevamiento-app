// establecimientos_columns.ts

const establecimientos_columns = [
  {
    Header: "Establecimiento",
    accessor: "institucion",
  },
  {
    Header: "Modalidad/Nivel",
    accessor: "modalidad_nivel",
  },
  { Header: "CUE", accessor: "cue" },
  { Header: "CUI", accessor: "cui" },
  { Header: "Matrícula", accessor: "matricula" },
  { Header: "Calle", accessor: "calle" },
  { Header: "Referencia", accessor: "modalidad_nivel" },
  { Header: "Provincia", accessor: "provincia" },
  {
    Header: "Departamento",
    accessor: "departamento",
  },
  {
    Header: "Localidad/Paraje",
    accessor: "localidad",
  },
  // Nueva columna de acciones (Eliminar)
  {
    Header: "Acciones",
    accessor: "acciones",
    Cell: ({ row }: { row: { original: { id: string } } }) => (
      <button
        onClick={() => {
          const id = row.original.id; // Accede a 'id' correctamente
          console.log(id); // Aquí puedes realizar la lógica de eliminación usando el 'id'
        }}
        className="bg-red-500 text-white p-1 rounded"
      >
        Eliminar
      </button>
    ),
  },
];

export default establecimientos_columns;
