import React, { ChangeEvent, FormEvent, useState } from "react";

interface Column {
  header: string;
  accessor: string;
  inputType?: string; // Tipo de input para el formulario (text, number, etc.)
}

interface FormData {
  [key: string]: string;
}

interface TableProps {
  columns: Column[];
  addRowButtonText?: string; 
  addButtonText: string; // Nueva prop para el texto del botón
  onSubmit: (data: FormData[]) => void;
}

const Table: React.FC<TableProps> = ({ columns, onSubmit, addRowButtonText, addButtonText }) => {
  const [data, setData] = useState<FormData[]>([{}]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>, rowIndex: number, accessor: string) => {
    const newData = [...data];
    newData[rowIndex][accessor] = event.target.value;
    setData(newData);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(data);
    // Puedes agregar lógica adicional aquí, como limpiar el formulario,
    // mostrar un mensaje de éxito, etc.
  };

  const isFirstRowComplete = () => {
    const firstRow = data[0];
    return columns.every(column => {
      const value = firstRow[column.accessor];
      return value !== undefined && value !== "";
    });
  };


  const handleAddRow = () => {
    if (isFirstRowComplete()) { // Solo agrega si la primera fila está completa
      setData([...data, {}]);
    } else {
      alert("Debes completar la primera fila antes de agregar otra."); // Mensaje de alerta
    }
  };



  return (
    <form onSubmit={handleSubmit} className="w-full mb-4">
      <table className="w-full shadow-md rounded-lg overflow-hidden">
        <thead className="bg-slate-200  font-bold">
          <tr className="">
            {columns.map((column) => (
              <th key={column.accessor} className="px-4 py-2 text-left">{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>        
            {columns.map((column) => (
              <td key={column.accessor} className="border px-4 py-2">
                {column.inputType ? (
                  <input
                    type={column.inputType}
                    value={row[column.accessor] || ""}
                    onChange={(event) => handleChange(event, rowIndex, column.accessor)}
                    className="w-full border-none focus:outline-none box-border"
                  />
                ) : (
                  <span>{row[column.accessor] || ""}</span>
                )}
              </td>
            ))}
          </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-2"> {/* Contenedor para botones */}
        <button
          type="button"
          onClick={handleAddRow}
          className="bg-slate-100 hover:bg-slate-200 border font-bold py-2 px-4 rounded"
        >
          {addRowButtonText}
        </button>
        <button
          type="submit"
          className="bg-slate-100 hover:bg-slate-200 border font-bold py-2 px-4 rounded"
        >
          {addButtonText}
        </button>
      </div>
    </form>
  );
};

export default Table;
