import React from "react";

interface SelectProps {
  label: string;
  value: string;
  options: {value: number; label: string}[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({label, value, options, onChange}) => {
  return (
    <div className="flex flex-col justify-center ">
      <p className="text-sm text-black font-bold">{label}</p>
      <div className="flex flex-col justify-end border rounded-lg">
        <select
          id={label}
          value={value}
          onChange={onChange}
          className="p-2 border rounded"
        >
          <option value="" disabled>Seleccionar</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
