"use client";

import LocalesPorConstruccion from "@/components/Forms/LocalesPorConstruccion";
import ObservacionesComponent from "@/components/Forms/ObservacionesComponent";
import { useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}

export default function EspaciosEscolaresComponent() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs: Tab[] = [
    {
      label: "Locales por Construcción",
      content: <LocalesPorConstruccion />,
    },
    {
      label: "Observaciones",
      content: <ObservacionesComponent />,
    },
  ];
  return (
    <div className="h-full bg-white text-black">
      <div className="mt-4 flex px-8">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(index)}
            className={`py-2 px-8 justify-center items-center w-screen ${
              selectedTab === index
                ? "border-b-2 border font-bold"
                : "text-submenu-highlight opacity-70 hover:text-submenu-highlight"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto no-scrollbar mb-20 flex justify-center items-center bg-white">
        {tabs[selectedTab].content}
      </div>
    </div>
  );
}
