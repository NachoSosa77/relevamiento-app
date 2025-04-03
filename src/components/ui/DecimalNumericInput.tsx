import React from "react";

interface InputProps {
  label: string;
  subLabel: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  disabled: boolean;
}

const DecimalNumericInput: React.FC<InputProps> = ({
  label,
  subLabel,
  value,
  onChange,
  disabled,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const sanitizedValue = newValue
      .replace(/[^0-9.,]/g, "")
      .replace(/(\..*)\./g, "$1")
      .replace(/(,.*),/g, "$1");

    if (sanitizedValue === "" || sanitizedValue === "." || sanitizedValue === ",") {
      onChange(undefined);
      return;
    }

    const normalizedValue = sanitizedValue.replace(",", ".");
    const parsedValue = parseFloat(normalizedValue);

    if (!isNaN(parsedValue)) {
      const roundedValue = Math.round(parsedValue * 100) / 100;
      onChange(roundedValue);
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className="flex flex-col justify-center ">
      <p className="text-sm text-black">{label}</p>
      <div className="flex flex-row p-1 justify-end border rounded-lg">
        <input
          className="text-black mr-2 w-full text-center p-0"
          type="text"
          id={label}
          value={value !== undefined ? value.toString().replace(".", ",") : ""}
          onChange={handleChange}
          maxLength={10}
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]{0,2}"
          disabled={disabled}
        />
        <p className="text-xs text-gray-500 mr-2">{subLabel}</p>
      </div>
    </div>
  );
};

export default DecimalNumericInput;
