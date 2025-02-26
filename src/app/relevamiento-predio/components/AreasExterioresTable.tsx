import { AreasExteriores, Column } from "@/interfaces/AreaExterior";
import { areasExterioresService } from "@/services/areasExterioresService";
import React, { useEffect, useState } from "react";

interface AreasExterioresFormProps {
  columnsConfig: Column[];
}

const AreasExterioresTable: React.FC<AreasExterioresFormProps> = ({
  columnsConfig,
}) => {
  const [servicios, setServicios] = useState<AreasExteriores[]>([]);
  const [areaId, setAreaId] = useState<number | null>(null);

  console.log('SERVICIOS', servicios);

  useEffect(() => {
    if (areaId) {
      fetchAreaData(areaId);
    }
  }, [areaId]);

  const fetchAreaData = async (id: number) => {
    try {
      const data = await areasExterioresService.getAreasExterioresById(id);
      console.log('DATA', data);
      setServicios([data]);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  return (
    <div className="p-4 mx-10">
      <div>
        <label>ID del Área Exterior:</label>
        <input
          type="number"
          value={areaId || ""}
          onChange={(e) => setAreaId(Number(e.target.value))}
        />
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {columnsConfig.map((column) => (
              <th key={column.key} className="border p-2 text-left">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio, index) => (
            <tr key={servicio.id}>
              {columnsConfig.map((column) => (
                <td key={`${servicio.id}-${column.key}`} className="border p-2">
                  {column.type === "text" && <div>{String(servicio[column.key] ?? "")}</div>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AreasExterioresTable;
