import React, { ChangeEvent } from "react";
interface InputProps {
    label: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void; // Tipo correcto para onChange
}

const TextInput: React.FC<InputProps> = ({
    label,
    value,
    onChange,
}) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value.replace(/[^a-zA-Z0-9\sÁÉÍÓÚáéíóúñÑüÜ¿?¡!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g, ""); // Permite alfanuméricos y espacios
        onChange({ ...event, target: { ...event.target, value: newValue } });
    };

    return (
        <div className="flex flex-col justify-center">
            <p className="text-sm text-black font-bold">{label}</p>
            <div className="flex justify-end border rounded-lg">
                <input
                    className="p-2 border rounded"
                    type="text"
                    id={label}
                    value={value}
                    onChange={handleChange}
                ></input>

            </div>
        </div>
    );
};

export default TextInput;
