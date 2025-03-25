/* eslint-disable @typescript-eslint/no-explicit-any */
// ReusableTable.tsx
import React from "react";


interface ReusableTableProps<T> {
  data: T[];
  columns: {
    Header: string;
    accessor: keyof T;
    Cell?: React.FC<{ value: T[keyof T] }>;
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
          {columns.map((column, columnIndex) => (
            <th key={`${columnIndex}-${column.Header}`} className="border p-2">
              {column.Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr key="empty-row">
            {columns.map((column, columnIndex) => (
              <td key={`${columnIndex}-empty-cell`} className="border py-4  ">
                {/* Celda vacía */}
              </td>
            ))}
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <td key={`${rowIndex}-${columnIndex}`} className="border py-2">
                  {column.Cell ? (
                    <column.Cell value={row[column.accessor]} />
                  ) : (
                    row[column.accessor]
                  )}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ReusableTable;
