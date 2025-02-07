import React, { useState } from "react";

interface CheckProps {
  label: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
}

const Check: React.FC<CheckProps> = ({ label, checked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    onChange(event.target.checked);
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <p className="text-sm text-black font-bold">{label}</p>
      <div className="flex flex-col justify-end border rounded-lg">
        <input
          type="checkbox"
          id={label}
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="p-2 border rounded"
        >          
        </input>
      </div>
    </div>
  );
};

export default Check;
