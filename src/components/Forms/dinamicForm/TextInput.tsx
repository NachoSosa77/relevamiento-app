import { Textarea } from "@/components/ui/textarea";
import React, { ChangeEvent } from "react";

interface TextInputProps {
  label: string;
  subLabel: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({ label, subLabel, value, onChange 
}) => {
  return (
    <div className="mt-4 text-sm">
      <Textarea
        placeholder={"Escriba aquí sus observaciones"}
        className="p-2 border border-gray-300 w-full"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextInput;
