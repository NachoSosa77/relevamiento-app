import React, { useEffect, useState } from "react";

interface InputProps {
  label?: string;
  subLabel?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
  onBlur?: () => void; // ✅ Agregá esta línea
}

const DecimalNumericInput: React.FC<InputProps> = ({
  label = "",
  subLabel = "",
  value,
  onChange,
  disabled = false,
  
}) => {
  const [inputValue, setInputValue] = useState("");

  // Solo sincroniza cuando el valor externo cambia pero no mientras el usuario escribe
  useEffect(() => {
  if (value !== undefined && value !== null && !isNaN(value)) {
    const formatted = value.toString().replace(".", ",");
    if (formatted !== inputValue) {
      setInputValue(formatted);
    }
  } else if ((value === undefined || value === null) && inputValue !== "") {
    setInputValue("");
  }
}, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Permitimos solo números, coma y punto
    raw = raw.replace(/[^0-9.,]/g, "");

    // Reemplazamos el punto por coma si lo hay
    raw = raw.replace(".", ",");

    // Permitimos solo una coma
    const parts = raw.split(",");
    if (parts.length > 2) return;

    // Limitar los decimales a 2 si ya hay coma
    if (parts.length === 2) {
      parts[1] = parts[1].slice(0, 2);
      raw = `${parts[0]},${parts[1]}`;
    }

    setInputValue(raw);

    const parsed = parseFloat(raw.replace(",", "."));
    onChange(!isNaN(parsed) ? parsed : undefined);
  };

  const handleBlur = () => {
    if (inputValue === "") return;

    const parsed = parseFloat(inputValue.replace(",", "."));
    if (!isNaN(parsed)) {
      const formatted = parsed.toFixed(2).replace(".", ",");
      setInputValue(formatted); // Aplica formato final
    }
  };

  return (
    <div className="flex flex-col justify-center">
      {label && <p className="text-sm text-black">{label}</p>}
      <div className="flex flex-row p-1 justify-end border rounded-lg">
        <input
          className="text-black mr-2 w-full text-center p-0"
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={12}
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]{0,2}"
          disabled={disabled}
        />
        {subLabel && <p className="text-xs text-gray-500 mr-2">{subLabel}</p>}
      </div>
    </div>
  );
};

export default DecimalNumericInput;
