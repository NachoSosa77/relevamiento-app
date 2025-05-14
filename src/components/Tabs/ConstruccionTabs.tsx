'use client'

import { useAppSelector } from "@/redux/hooks";
import { Tab } from "@headlessui/react";
import LocalForm from "./LocalForm"; // Este es tu componente de formulario

const ConstruccionTabs = () => {
  // Obtén la cantidad de construcciones desde Redux
  const cantidadConstrucciones = useAppSelector(
    (state) => state.espacio_escolar.cantidadConstrucciones
  );
  
  // Genera un array con las construcciones según la cantidad desde Redux
  const construcciones = Array.from({ length: cantidadConstrucciones }, (_, i) => ({
    id: i + 1,
    numero_construccion: i + 1,
    relevamiento_id: 45, // Ajusta esto según sea necesario
  }));

  return (
    <div className="w-full">
      <Tab.Group>
        <Tab.List className="flex space-x-1">
          {construcciones.map((construccion) => (
            <Tab
              key={construccion.id}
              className={({ selected }) =>
                selected
                  ? "px-4 py-2 text-white bg-blue-500"
                  : "px-4 py-2 text-blue-500"
              }
            >
              {`Construcción ${construccion.numero_construccion}`}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {construcciones.map((construccion) => (
            <Tab.Panel key={construccion.id}>
              <div>
                <h2>Formulario de construcción {construccion.numero_construccion}</h2>
                {/* Aquí carga el formulario de locales y otros datos */}
                <LocalForm construccionId={construccion.id} />
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ConstruccionTabs;
