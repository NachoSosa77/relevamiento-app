'use client'


import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import Navbar from "@/components/NavBar/NavBar";

export default function HomePage() {

    return (
        <div className="h-screen overflow-hidden">
            <Navbar />
            <div className="flex justify-end mt-20 mb-8 mx-4">
                <div className="flex flex-col items-end">
                    <h1 className="font-bold">PLANILLA GENERAL</h1>
                    <h4 className="text-sm">DE RELEVAMIENTO PEDAGÓGICO</h4>
                </div>
            </div>
            <CuiComponent/>
            {/* <div className="mx-10">
                <p className="text-sm">COMPLETE UNA PLANILLA POR CADA PREDIO</p>
                <div className="flex mt-2 p-2 border items-center">
                    <div className="w-6 h-6 flex justify-center text-white bg-black"><p>A</p></div>
                    <div><p className="text-sm font-bold justify-center ml-4">CUI (Código Único de Infraestructura)</p></div>
                    <div className="ml-auto">
                        <AlphanumericInput label={""} value={inputValue} onChange={(newValue)=>setInputValue(newValue)} />
                    </div>
                </div>
                    <div className="flex p-2 border">
                        <p className="text-sm text-gray-400">Transcriba de la hoja de ruta el Número de CUI</p>
                    </div>
            </div> */}
        </div>
    )
}
