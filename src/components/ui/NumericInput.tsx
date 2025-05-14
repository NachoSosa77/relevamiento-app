import React from "react";

interface InputProps {
  label?: string;
  subLabel?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
}

const NumericInput: React.FC<InputProps> = ({
  label = "",
  subLabel = "",
  value,
  onChange,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/[^0-9]/g, ""); // Solo números
    onChange(newValue ? parseInt(newValue, 10) : undefined);
  };

  return (
    <div className="flex flex-col justify-center">
      {label && <p className="text-sm text-black">{label}</p>}
      <div className="flex flex-row p-1 justify-end border rounded-lg">
        <input
          className="text-black mr-2 w-full text-center p-0"
          type="text"
          value={value !== undefined ? value.toString() : ""}
          onChange={handleChange}
          maxLength={10}
          inputMode="numeric"
          pattern="[0-9]*"
          disabled={disabled}
        />
        {subLabel && <p className="text-xs text-gray-500 mr-2">{subLabel}</p>}
      </div>
    </div>
  );
};

export default NumericInput;
