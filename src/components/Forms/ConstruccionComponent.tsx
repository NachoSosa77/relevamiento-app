import { useAppSelector } from "@/redux/hooks";
import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import LocalesPorConstruccionComponent from "./LocalesPorConstruccion";

const ConstruccionComponent = () => {
  const construcciones = useAppSelector((state) => state.construcciones.construcciones);
  const cantidadConstrucciones = useAppSelector((state) => state.espacio_escolar.cantidadConstrucciones);
  //console.log('construcciones', construcciones)
  //console.log('cantidadConstrucciones', cantidadConstrucciones)

  const [mostrarTabs, setMostrarTabs] = useState(false);

  // Controlamos que las tabs se muestren solo cuando la cantidad haya sido configurada
  useEffect(() => {
  if (cantidadConstrucciones !== undefined && cantidadConstrucciones > 0) {
    setMostrarTabs(true);
  }
}, [cantidadConstrucciones]);

  if (!mostrarTabs) {
    return (
      <p className="text-center">Por favor, ingresa el número de construcciones primero.</p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Construcciones y sus Locales</h2>
      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b">
          {construcciones.map((c) => (
            <Tab
              key={c.id}
              className={({ selected }) =>
                selected ? "border-b-2 border-blue-500 p-2" : "p-2"
              }
            >
              Construcción #{c.numero_construccion}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {construcciones.map((c) => (
            <Tab.Panel key={c.id}>
              <LocalesPorConstruccionComponent
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ConstruccionComponent;
