import React from "react";
type SelectValue = string | number | string[];

// Hacemos que SelectProps sea genérico para permitir tanto 'string' como 'number'
interface SelectProps<T> {
  label: string;
  value: SelectValue;
  options: { value: T; label: string }[]; // Usamos 'T' tanto en 'value' como en las opciones
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  multiple?: boolean; // nuevo prop
}

const Select = <T extends string | number>({
  label,
  value,
  options,
  onChange,
  multiple = false
}: SelectProps<T>) => {
  return (
    <div className="flex flex-col justify-center">
      <p className="text-sm text-black font-bold">{label}</p>
      <div className="flex flex-col justify-end border rounded-lg">
        <select
          id={label}
          value={value}
          onChange={onChange}
          className="p-2 border rounded"
          multiple={multiple} // Usamos el nuevo prop aquí
        >
          {!multiple && <option value="" disabled>Seleccionar</option>}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
