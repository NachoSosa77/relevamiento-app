import React, { useEffect, useState } from "react";

interface InputProps {
  label?: string;
  subLabel?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
}

const DecimalNumericInput: React.FC<InputProps> = ({
  label = "",
  subLabel = "",
  value,
  onChange,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value !== undefined && !isNaN(value)) {
      // Siempre mostramos con 2 decimales y coma
      const formatted = value.toFixed(2).replace(".", ",");
      setInputValue(formatted);
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Permitimos solo números, coma y punto
    raw = raw.replace(/[^0-9.,]/g, "");

    // Reemplazamos el punto por coma si lo hay
    raw = raw.replace(".", ",");

    // Permitimos solo una coma en el número
    const parts = raw.split(",");
    if (parts.length > 2) return; // Si hay más de una coma, es inválido

    // Limitar los decimales a 2, si existe una coma
    if (parts.length === 2) {
      parts[1] = parts[1].slice(0, 2); // Solo 2 decimales
      raw = `${parts[0]},${parts[1]}`;
    }

    setInputValue(raw);

    // Convertimos a float (usando punto como separador decimal internamente)
    const parsed = parseFloat(raw.replace(",", "."));
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else {
      onChange(undefined);
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
