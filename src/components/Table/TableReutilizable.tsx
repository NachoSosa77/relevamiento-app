// ReusableTable.tsx
import React from "react";

interface ReusableTableProps<T> {
  data: T[];
  columns: {
    Header: string;
    accessor: keyof T; // Garantiza que la clave exista en el tipo T
    Cell?: React.FC<{ value: T[keyof T] }>; // Renderizado personalizado de celda (opcional)
  }[];
}

const ReusableTable: React.FC<ReusableTableProps<any>> = ({
  data,
  columns,
}) => {
  return (
    <table className="w-full mt-2 border-collapse table-auto text-sm text-center">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((column) => (
            <th key={column.Header} className="border p-2">
              {column.Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.accessor} className="border py-2">
                {/* Renderizado personalizado o valor predeterminado */}
                {column.Cell ? (
                  <column.Cell value={row[column.accessor]} />
                ) : (
                  row[column.accessor]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReusableTable;
