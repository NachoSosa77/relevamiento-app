import React from "react";

interface InputProps {
  label: string;
  subLabel: string;
  value: number | string | undefined; // Permitir número o string para el valor inicial
  onChange: (value: string) => void;
  disabled: boolean;
}

const NumericInput: React.FC<InputProps> = ({
  label,
  subLabel,
  value,
  onChange,
  disabled
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/[^0-9]/g, ""); // Permite solo numeros
    onChange(newValue.substring(0, 8)); // Limita a 8 caracteres
  };

  return (
    <div className="flex flex-col justify-center ">
      <p className="text-sm text-black">{label}</p>
      <div className="flex flex-row p-1 justify-end border rounded-lg">
        <input
          className="text-black mr-2 w-full text-center"
          type="text"
          id={label}
          value={value}
          onChange={handleChange}
          maxLength={8}
          inputMode="numeric" // Mejora la experiencia en dispositivos móviles
          pattern="[0-9]*" // Ayuda a la validación en algunos navegadores
          disabled={disabled}
        ></input>
        <p className="text-sm text-gray-500 mr-2">{subLabel}</p>
      </div>
    </div>
  );
};

export default NumericInput;
