import { useState } from "react";
import AlphanumericInput from "../ui/AlphanumericInput";
import Check from "../ui/Checkbox";
import FileUpload from "../ui/FileUpLoad";

export default function PlanoComponent() {
  const [showComponents, setShowComponents] = useState<boolean | null>(null); // Estado para controlar la visibilidad de los componentes
  const [siChecked, setSiChecked] = useState(false); // Estado para el checkbox "SI"
  const [noChecked, setNoChecked] = useState(false); // Estado para el checkbox "NO"

  const handleSiChange = (checked: boolean) => {
    if (checked) {
      // Solo si se va a marcar "SI"
      setSiChecked(true);
      setNoChecked(false); // Desmarca "NO" si se marca "SI"
      setShowComponents(true); // Muestra los componentes si se marca "SI"
    } else {
      // Si se va a desmarcar "SI"
      setSiChecked(false);
      setShowComponents(null); // Oculta los componentes si se desmarca "SI"
    }
  };

  const handleNoChange = (checked: boolean) => {
    if (checked) {
      // Solo si se va a marcar "NO"
      setNoChecked(true);
      setSiChecked(false); // Desmarca "SI" si se marca "NO"
      setShowComponents(false); // Oculta los componentes si se marca "NO"
    } else {
      // Si se va a desmarcar "NO"
      setNoChecked(false);
      setShowComponents(null); // Oculta los componentes si se desmarca "NO"
    }
  };

  const handleFileUpload = (file: File | null) => {
    // Aquí puedes hacer algo con el archivo, como enviarlo a un servidor
    console.log("Archivo subido:", file);
  };

  return (
    <div className="mx-10 my-4">
      <div className="flex p-1 bg-gray-100 border">
        <p className="text-sm text-gray-400">
          En esta planilla se regisrtan datos de todas las construcciones, los
          locales y las áreas exteriores del predio.
        </p>
      </div>
      <div className="flex p-2 border items-center">
        <div className="w-6 h-6 flex justify-center text-white bg-black">
          <p>1</p>
        </div>
        <div className="flex justify-between w-full">
          <div className="justify-center flex flex-col">
            <p className="text-sm font-bold ml-4 justify-center">
              CORRESPONDE ACTUALIZAR O REALIZAR PLANOS
            </p>
          </div>
          <div className="text-sm font-bold mr-4 flex flex-row gap-4">
            <Check
              label="SI"
              checked={siChecked}
              onChange={handleSiChange}
              disabled={noChecked} // Deshabilita "SI" si "NO" está marcado
            ></Check>
            <Check
              label="NO"
              checked={noChecked}
              onChange={handleNoChange}
              disabled={siChecked} // Deshabilita "NO" si "SI" está marcado
            ></Check>
          </div>
          <div className="mr-4">
            <FileUpload onFileChange={handleFileUpload} />
          </div>
        </div>
      </div>
      <div className="flex flex-col p-1 bg-gray-100 border">
        <p className="text-sm text-gray-400">
          Indique SI si se trata de un edificio del sistema educativo de gestión
          estatal. Indique NO si se trata de CUE-Anexos que funcionan en un
          edificio de una institución no escolar cedido por el sector de gestión
          privada.
        </p>
        <p className="text-sm text-gray-400">
          Si contesto SI complete la totalidad de los items.
        </p>
        <p className="text-sm text-gray-400">
          Si contesto NO complete exclusivamente los siguientes campos: cantidad
          de construcciones (sólo si el CUE-Anexos hace uso al menos una
          construcción completa), tipo y superficie de las áreas exteriores y
          tipo y superficie de los locales por construcción (sólo de los que usa
          el CUE-Anexo)
        </p>
      </div>
      {/*  Compoenentes 2 y 3 */}
      {showComponents === true ? ( // Solo se renderizan si showComponents es true
        <div className="flex flex-col gap-8">
          <div className="flex mt-4 p-2 border items-center w-1/2">
            <div className="w-6 h-6 flex justify-center text-white bg-black">
              <p>2</p>
            </div>
            <div className="flex justify-between w-full">
              <div className="justify-center flex flex-col">
                <p className="text-sm font-bold ml-4 justify-center">
                  SUPERFICIE TOTAL DEL PREDIO
                </p>
              </div>
              <div className="flex gap-4">
                <AlphanumericInput
                  label=""
                  value=""
                  subLabel="m² O-NS"
                  onChange={() => console.log("Superficie total del predio")}
                />
              </div>
            </div>
          </div>
          <div className="flex p-2 border items-center w-1/2">
            <div className="w-6 h-6 flex justify-center text-white bg-black">
              <p>3</p>
            </div>
            <div className="flex justify-between w-full">
              <div className="justify-center flex flex-col">
                <p className="text-sm font-bold ml-4 justify-center">
                  CANTIDAD DE CONSTRUCCIONES EN EL PREDIO
                </p>
              </div>
              <div className="flex flex-row gap-4">
                <AlphanumericInput
                  label=""
                  value=""
                  subLabel=""
                  onChange={() =>
                    console.log("Cantidad de construcciones en el predio")
                  }
                />
              </div>
            </div>
          </div>
          <div></div>
        </div>
      ) : showComponents === false ? ( // Nueva condición para mostrar solo el componente 3
        <div className="flex flex-col gap-8">
          <div className="flex mt-4 p-2 border items-center w-1/2">
            <div className="w-6 h-6 flex justify-center text-white bg-black">
              <p>3</p>
            </div>
            <div className="flex justify-between w-full">
              <div className="justify-center flex flex-col">
                <p className="text-sm font-bold ml-4 justify-center">
                  CANTIDAD DE CONSTRUCCIONES EN EL PREDIO
                </p>
              </div>
              <div className="flex flex-row gap-4">
                <AlphanumericInput
                  label=""
                  value=""
                  subLabel=""
                  onChange={() =>
                    console.log("Cantidad de construcciones en el predio")
                  }
                />
              </div>
            </div>
          </div>
          <div className=""></div>
        </div>
      ) : null}{" "}
      {/* No muestra nada si showComponents es null */}
    </div>
  );
}
