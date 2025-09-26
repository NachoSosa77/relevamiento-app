import React from "react";

interface SkeletonProps {
  rows?: number;
  columns?: number;
}

const ServiciosTransporteSkeleton: React.FC<SkeletonProps> = ({
  rows = 8,
  columns = 5,
}) => {
  const rowArray = Array.from({ length: rows });
  const colArray = Array.from({ length: columns });

  return (
    <div className="p-2 mx-10 mt-4 bg-white rounded-lg border shadow-lg animate-pulse">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-custom text-white text-center">
            {colArray.map((_, colIndex) => (
              <th key={colIndex} className="border p-2 text-center">
                &nbsp;
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowArray.map((_, rowIndex) => (
            <tr key={rowIndex}>
              {colArray.map((_, colIndex) => (
                <td key={colIndex} className="border p-2 text-center">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <div className="h-8 w-40 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default ServiciosTransporteSkeleton;
