import React from "react";

type SelectValue = string | number | string[];

interface SelectProps<T> {
  label: string;
  value: SelectValue;
  options: { value: T; label: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  multiple?: boolean;
  direction?: "row" | "col"; // ← opcional
}

const Select = <T extends string | number>({
  label,
  value,
  options,
  onChange,
  multiple = false,
  direction = "col",
}: SelectProps<T>) => {
  const isRow = direction === "row";

  return (
    <div className={`flex ${isRow ? "flex-row items-center gap-2" : "flex-col"}`}>
      {label && (
        <label htmlFor={label} className="text-sm text-black whitespace-nowrap">
          {label}
        </label>
      )}
      <select
        id={label}
        value={value}
        onChange={onChange}
        className="p-2 border rounded min-w-[150px]"
        multiple={multiple}
      >
        {!multiple && <option value="" disabled>Seleccionar</option>}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
