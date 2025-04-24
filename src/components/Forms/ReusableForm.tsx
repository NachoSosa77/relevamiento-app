/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ReusableFormProps<T> {
  columns: {
    Header: string;
    accessor: string | number;
    inputType?: "number" | "date" | "time" | "text";
  }[];
  onSubmit: (data: T) => void;
  onCancel: () => void;
  initialValues?: T;
}

interface FormData {
  [key: string]: string | number | undefined;
}

const ReusableForm: React.FC<ReusableFormProps<any>> = ({
  columns,
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    if (initialValues) {
      // Reset the formData if there are new initialValues (e.g., when editing)
      setFormData(initialValues);
      toast.info("Datos precargados correctamente");
    } else {
      // Reset the formData if there's no initialValues (e.g., when adding new data)
      setFormData({});
    }
  }, [initialValues]); // This effect will trigger every time the initialValues change

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
    toast.success("Datos cargados correctamente");
    setFormData({}); // Reset the form after submit
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {columns.map((column) => (
        <div key={column.accessor.toString()} className="flex flex-col">
          <label
            htmlFor={column.accessor.toString()}
            className="text-sm font-semibold text-gray-700 mb-1"
          >
            {column.Header}
          </label>
          <input
            type={column.inputType || "text"}
            id={column.accessor.toString()}
            name={column.accessor.toString()}
            value={formData[column.accessor] || ""}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          />
        </div>
      ))}

      <div className="md:col-span-2 flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded shadow-md transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded shadow-md transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default ReusableForm;
