// ReusableForm.tsx
import React, { useState } from "react";

interface ReusableFormProps<T> {
  columns: {
    Header: string;
    accessor: keyof T;
    inputType: "number" | "date" | "time" | "text";
  }[];
  onSubmit: (data: T) => void;
  onCancel: () => void; // Nueva prop para la función cancelar
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReusableForm: React.FC<ReusableFormProps<any>> = ({
  columns,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
    setFormData({}); // Limpia el formulario después de enviar
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap -m-2">
      {columns.map((column) => (
        <div key={column.accessor} className="w-1/2 p-2">
          <label
            htmlFor={column.accessor}
            className="block text-gray-700 font-bold mb-2"
          >
            {column.Header}
          </label>
          {(() => {
            switch (column.inputType) {
              case "date":
                return (
                  <input
                    type="date"
                    id={column.accessor}
                    name={column.accessor}
                    value={formData[column.accessor] || ""}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  />
                );
              case "time":
                return (
                  <input
                    type="time"
                    id={column.accessor}
                    name={column.accessor}
                    value={formData[column.accessor] || ""}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  />
                );
              case "number":
                return (
                  <input
                    type="number"
                    id={column.accessor}
                    name={column.accessor}
                    value={formData[column.accessor] || ""}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  />
                );
              case "text":
              default:
                return (
                  <textarea
                    id={column.accessor}
                    name={column.accessor}
                    value={formData[column.accessor] || ""}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  />
                );
            }
          })()}
        </div>
      ))}
      <div className="w-full p-2 flex">
        {/* Contenedor para los botones */}
        <div className="w-1/2 pr-2">
          <button
            type="button" // Importante: type="button" para evitar el submit del formulario
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onCancel} // Llama a la función onCancel al hacer clic
          >
            Cancelar
          </button>
        </div>
        <div className="w-1/2 pl-2">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReusableForm;
