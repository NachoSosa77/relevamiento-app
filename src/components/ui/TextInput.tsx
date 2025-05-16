import React, { ChangeEvent } from "react";
interface InputProps {
  label: string;
  sublabel: string;
  value: string;
  className?: string; // Prop para clases de CSS personalizadas
  onChange: (event: ChangeEvent<HTMLInputElement>) => void; // Tipo correcto para onChange
}

const TextInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  sublabel,
  className,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(
      /[^a-zA-Z0-9\sÁÉÍÓÚáéíóúñÑüÜ¿?¡!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g,
      ""
    ); // Permite alfanuméricos y espacios
    onChange({ ...event, target: { ...event.target, value: newValue } });
  };

  return (
    <div className={`flex items-center justify-center gap-2 text-sm ${className || ""}`}>
      <p className="text-xs text-black font-bold">{label}</p>
      <div className="flex justify-end border rounded-lg">
        <input
          className="p-1 border rounded"
          type="text"
          id={label}
          value={value}
          onChange={handleChange}
          placeholder={sublabel}
        ></input>
      </div>
    </div>
  );
};

export default TextInput;
