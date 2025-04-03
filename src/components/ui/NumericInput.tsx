import React from "react";



interface InputProps {
  label: string;
  subLabel: string;
  value: number | undefined; 
  onChange: (value: number | undefined) => void;
  disabled: boolean;
}

const NumericInput: React.FC<InputProps> = ({
  label,
  subLabel,
  value,
  onChange,
  disabled,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/[^0-9]/g, ""); // Permite solo numeros
    onChange(newValue ? parseInt(newValue, 10) : undefined); // Convierte a number o undefined
  };

  return (
    <div className="flex flex-col justify-center ">
      <p className="text-sm text-black">{label}</p>
      <div className="flex flex-row p-1 justify-end border rounded-lg">
        <input
          className="text-black mr-2 w-full text-center p-0"
          type="text"
          id={label}
          value={value !== undefined ? value.toString() : ""} // Maneja undefine}
          onChange={handleChange}
          maxLength={10}
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
