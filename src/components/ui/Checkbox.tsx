import React from "react";

interface CheckProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean; // Nueva prop para deshabilitar el checkbox
}

const Check: React.FC<CheckProps> = ({  label, checked, onChange, disabled }) => {


  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-sm text-custom font-bold">{label}</p>
      <div className="flex flex-col justify-end border rounded-lg">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled} // Se aplica la prop disabled al input
          className="p-2 border rounded"
        />          
      </div>
    </div>
  );
};

export default Check;
