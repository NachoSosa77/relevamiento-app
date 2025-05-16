// components/BloquePregunta.tsx

import React from "react";

interface BloquePreguntaProps {
  label: string;
  children: React.ReactNode;
}

const BloquePregunta: React.FC<BloquePreguntaProps> = ({ label, children }) => {
  return (
    <div className="grid grid-cols-[40px_1fr] gap-4 items-start mt-4">
      <div className="w-10 h-10 flex justify-center items-center rounded-full bg-slate-200 font-bold text-gray-700">
        {label}
      </div>
      <div className="flex flex-col gap-2 w-full">{children}</div>
    </div>
  );
};

export default BloquePregunta;
