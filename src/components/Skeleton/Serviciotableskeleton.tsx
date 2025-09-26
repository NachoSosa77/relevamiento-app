// src/app/relevamiento-predio/components/ServiciosSkeleton.tsx
import { Column } from "@/interfaces/ServiciosBasicos";
import React from "react";

interface ServiciosSkeletonProps {
  columnsConfig: Column[];
  rows?: number;
}

const ServiciosSkeleton: React.FC<ServiciosSkeletonProps> = ({
  columnsConfig,
  rows = 5,
}) => {
  return (
    <div className="p-2 mx-10 mt-4 bg-white rounded-lg border shadow-lg animate-pulse">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-custom text-white text-center">
            {columnsConfig.map((column) => (
              <th
                key={column.key}
                className={`border p-2 text-center ${
                  column.key === "id" ? "bg-custom/50 text-white" : ""
                }`}
              >
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto">&nbsp;</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {columnsConfig.map((col, colIdx) => (
                <td key={colIdx} className="border p-2 text-center">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto">&nbsp;</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiciosSkeleton;
