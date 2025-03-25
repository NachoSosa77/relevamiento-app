// ReusableForm.tsx
import React, { useEffect, useState } from "react";

interface ReusableFormProps<T> {
  columns: {
    Header: string;
    accessor: string | number;
    inputType?: "number" | "date" | "time" | "text";
  }[];
  onSubmit: (data: T) => void;
  onCancel: () => void; // Nueva prop para la función cancelar
  initialValues?: T; // Nueva prop para los valores iniciales
  }

interface FormData {
  [key: string]: string | number | undefined; // O los tipos específicos que necesites
  // O definir propiedades específicas
  // nombre?: string;
  // fechaNacimiento?: Date;
  // ...
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReusableForm: React.FC<ReusableFormProps<any>> = ({
  columns,
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        <div key={column.accessor as string | number} className="w-1/2 p-2">
          <label
            htmlFor={column.accessor as string}
            className="block text-gray-700 font-bold mb-2"
          >
            {column.Header}
          </label>
          {(() => {
            switch (column.inputType) {
              case "number":
                return (
                  <input
                    type="number"
                    id={column.accessor.toString()}
                    name={column.accessor.toString()}
                    value={formData[column.accessor]}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  />
                );
              case "text":
              default:
                return (
                  <input
                    type="text"
                    id={column.accessor.toString()}
                    name={column.accessor.toString()}
                    value={formData[column.accessor] || ""}
                    onChange={handleInputChange}
                    className="shadow text-sm text-slate-400 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
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
