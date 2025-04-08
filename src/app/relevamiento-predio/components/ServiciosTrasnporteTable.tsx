
import { Column, ServiciosTransporteComunicaciones } from '@/interfaces/ServiciosTransporteComunicaciones';
import React, { ChangeEvent, useState } from 'react';


interface ServiciostTransporteFormProps {
  serviciosData: ServiciosTransporteComunicaciones[];
  columnsConfig: Column[];
}

const ServiciosTransporteForm: React.FC<ServiciostTransporteFormProps> = ({ serviciosData, columnsConfig }) => {
  const [servicios, setServicios] = useState<ServiciosTransporteComunicaciones[]>(serviciosData);
  const [formData, setFormData] = useState<ServiciosTransporteComunicaciones[]>(serviciosData)

  const handleChange = (index: number, field: keyof ServiciosTransporteComunicaciones, value: string) => {
    const updatedServicios = [...servicios];
    updatedServicios[index][field] = value;
    setServicios(updatedServicios);
    setFormData(updatedServicios);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('SERVICIOS SUBMITTED', formData);
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 mx-10">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {columnsConfig.map((column) => (
              <th key={column.key} className={`border p-2 text-left ${
                column.key === "id" ? "bg-black text-white" : ""
              }`}>
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
                      value={servicio[column.key]}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange(index, column.key, e.target.value)}
                      className="w-full p-2 border rounded"
                      disabled={column.conditional && !column.conditional(servicio)} // Deshabilita según la condición
                    >
                      <option value="">Seleccionar</option>
                      {typeof column.options === 'function'
                      ? column.options(servicio)?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      )) : column.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))
                    }
                    </select>
                  )}
                  {column.type === 'input' && (
                    <input
                      type="text"
                      value={servicio[column.key]}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, column.key, e.target.value)}
                      className="w-full p-2 border rounded"
                      disabled={column.conditional && !column.conditional(servicio)} // Deshabilita según la condición
                    />
                  )}
                  {column.type === 'text' && <div>{servicio[column.key]}</div>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-end mt-4'>
            <button
              type="submit"
              className="text-sm font-bold bg-slate-200 p-4 rounded-md flex-nowrap"
            >
              Cargar Información
            </button>
          </div>
    </form>
  );
};

export default ServiciosTransporteForm;
