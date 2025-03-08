import { Column, ServiciosBasicos } from '@/interfaces/ServiciosBasicos';
import React, { ChangeEvent, useState } from 'react';

interface ServiciosBasicosFormProps {
  serviciosData: ServiciosBasicos[];
  columnsConfig: Column[];
}

const ServiciosBasicosForm: React.FC<ServiciosBasicosFormProps> = ({ serviciosData, columnsConfig }) => {
  const [servicios, setServicios] = useState<ServiciosBasicos[]>(serviciosData);
  const [formData, setFormData] = useState<ServiciosBasicos[]>(serviciosData);

  const handleChange = (index: number, field: keyof ServiciosBasicos, value: string) => {
    const updatedServicios = [...servicios];
    updatedServicios[index] = { ...updatedServicios[index], [field]: value };
    setServicios(updatedServicios);
    setFormData(updatedServicios);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('SERVICIOS SUBMITTED', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 mx-10">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {columnsConfig.map((column) => (
              <th
                key={column.key}
                className={`border p-2 text-left ${column.key === 'id' ? 'bg-black text-white' : ''}`}
              >
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
                  {column.type === 'select' && (
                    <select
                      value={servicio[column.key] as string}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange(index, column.key, e.target.value)}
                      className="w-full p-2 border rounded"
                      disabled={column.conditional && !column.conditional(servicio)}
                    >
                      <option value="">Seleccionar</option>
                      {Array.isArray(column.options)
                        ? column.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))
                        : column.options?.(servicio).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                    </select>
                  )}
                  {column.type === 'input' && (
                    <input
                      type="text"
                      value={servicio[column.key] as string}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, column.key, e.target.value)}
                      className="w-full p-2 border rounded"
                      disabled={column.conditional && !column.conditional(servicio)}
                    />
                  )}
                  {column.type === 'text' && <div>{servicio[column.key] as string}</div>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <button type="submit" className="text-sm font-bold bg-slate-200 p-4 rounded-md">
          Cargar Información
        </button>
      </div>
    </form>
  );
};

export default ServiciosBasicosForm;
