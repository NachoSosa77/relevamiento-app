import { AreasExteriores } from "@/app/lib/AreasExteriores";
import { TipoAreasExteriores } from "@/interfaces/TipoAreasExteriores";
import { useState } from "react";
import AlphanumericInput from "../ui/AlphanumericInput";
import Select from "../ui/SelectComponent";

export default function AreasExterioresComponent() {
  const [selectArea, setSelectArea] = useState<number | null>(null);
    const areasExteriores: TipoAreasExteriores[] = AreasExteriores;
    console.log(areasExteriores, "locales");
    const handleSelecteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectArea(Number(event.target.value));
    };

  return (
    <div className="mx-10">
      <div className="flex mt-2 p-4 border items-center justify-between">
        <div className="w-10 h-10 flex justify-center items-center text-white bg-black text-xl">
          <p>4</p>
        </div>
        <div className="justify-center">
          <p className="text-lg font-bold ml-4">ÁREAS EXTERIORES</p>
        </div>
        <div className="flex flex-col p-2 text-xs text-gray-400 bg-gray-100 border justify-end">
          <p className="font-semibold text-center">Tipo de áreas exteriores</p>
          <p>
            A-Patio B-Área de juegos de Nivel Inicial C-Expansión D-Playón
            Deportivo
          </p>
          <p>E-Anfiteatro F-Plaza seca G-Pileta H-Canchas Deportivas</p>
          <p>I-Huerta J-Corral K-Estacionamiento L-Áreas libres M-Otra</p>
        </div>
        {/* <div className="ml-auto">
                <AlphanumericInput
                    subLabel=""
                    label={""}
                    value={""}
                    onChange={() => set""()}
                />
                </div> */}
      </div>
      <form action="">
        <div className="flex mt-2 p-2 border items-center justify-between gap-2">
          <div className="flex flex-col border p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Identificación en el plano
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel="E"
                label={""}
                value={""}
                onChange={() => console.log("Datos")}
              />
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Tipo
            </p>
            <div className="mt-2 w-full">
            <Select
                label={""}
                value={selectArea?.toString() || ""}
                options={areasExteriores.map((local)=>({
                  value: local.id,
                  label: local.name,
                }))}                
                onChange={handleSelecteChange}
              ></Select>
            </div>
          </div>
          <div className="flex flex-col border  p-4 w-1/3">
            <p className="text-sm font-bold text-center bg-gray-100 p-2">
              Superficie
            </p>
            <div className="mt-2 w-full">
              <AlphanumericInput
                subLabel="m²"
                label={""}
                value={""}
                onChange={() => console.log("Datos")}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="text-sm font-bold bg-gray-100 p-2 rounded-md flex-nowrap"
            >
              Cargar Información
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
