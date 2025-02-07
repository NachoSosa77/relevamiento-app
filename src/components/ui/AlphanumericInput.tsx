import React from "react";

interface InputProps {
  label: string;
  subLabel: string;
  value: string;
  onChange: (value: string) => void;
}

const AlphanumericInput: React.FC<InputProps> = ({
  label,
  subLabel,
  value,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/[^a-zA-Z0-9]/g, ""); // Permite solo alfanuméricos
    onChange(newValue.substring(0, 8)); // Limita a 8 caracteres
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
        <p className="text-sm text-gray-500 mr-2">{subLabel}</p>
        {/* Opcional: mostrar un mensaje si el valor excede los 8 caracteres */}
        {value.length > 8 && (
          <p className="text-red-500">Máximo 8 caracteres</p>
        )}
      </div>
    </div>
  );
};

export default AlphanumericInput;
