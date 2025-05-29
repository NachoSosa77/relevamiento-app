/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface ReusableTableProps<T> {
  data: T[];
  columns: {
    Header: string;
    accessor: keyof T;
    Cell?: React.FC<{ value: T[keyof T]; row: { original: T; index: number } }>;
  }[];
  onRemove?: (id: number) => void;
}

const ReusableTable: React.FC<ReusableTableProps<any>> = ({ data, columns }) => {
  return (
    <table className="w-full text-sm text-center rounded-xl border border-gray-200 overflow-hidden">
      <thead>
        <tr className="bg-custom text-white">
          {columns.map((column, columnIndex) => (
            <th
              key={`${columnIndex}-${column.Header}`}
              className="border p-2"
            >
              {column.Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr key="empty-row">
            {columns.map((column, columnIndex) => (
              <td key={`${columnIndex}-empty-cell`} className="border py-4">
                {/* Celda vacía */}
              </td>
            ))}
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-50">
              {columns.map((column, columnIndex) => (
                <td
                  key={`${rowIndex}-${columnIndex}`}
                  className="border p-2 rounded-lg"
                >
                  {column.Cell ? (
                    <column.Cell
                      value={row[column.accessor]}
                      row={{ original: row, index: rowIndex }}
                    />
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
