import React from "react";
interface InputProps {
  label: string;
  subLabel: string;
  value: string | number | undefined; // Cambiado a string | number | undefined
  onChange: (value: string) => void; // Tipo correcto para onChange
}

const AlphanumericInput: React.FC<InputProps> = ({
  label,
  subLabel,
  value,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/[^a-zA-Z0-9]/g, ""); // Permite solo alfanuméricos
    onChange(newValue);
  };

  return (
    <div className="flex flex-col justify-center ">
      <p className="text-sm text-black">{label}</p>
      <div className="flex flex-row p-1 justify-end border rounded-lg">
        <input
          className="text-black mr-2 w-full"
          type="text"
          id={label}
          value={value}
          onChange={handleChange}
          maxLength={8}
        ></input>
        <p className="text-sm text-gray-500 mr-2 whitespace-nowrap">
          {subLabel}
        </p>
      </div>
    </div>
  );
};

export default AlphanumericInput;
