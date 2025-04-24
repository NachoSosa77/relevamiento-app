"use client";

import CuiComponent from "@/components/Forms/dinamicForm/CuiComponent";
import EstablecimientosPrivados from "@/components/Forms/EstablecimientosPrivados";
import RespondientesDelCuiComponent from "@/components/Forms/RespondientesDelCuiComponent";
import VisitasComponent from "@/components/Forms/VisitasComponent";
import Navbar from "@/components/NavBar/NavBar";
import { UserData } from "@/interfaces/UserData";
import { useAppSelector } from "@/redux/hooks";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";


export default function RelevamientoPredioPage() {
  const [user, setUser] = useState<UserData | null>(null); // Estado para guardar la info del usuario

  const selectedCui = useAppSelector((state) => state.espacio_escolar.cui);

  // Obtiene el usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/get-token", { credentials: "include" });
        const data = await res.json();
        //console.log("Token obtenido desde backend:", data.token);

        if (data.token) {
          const decodedUser: UserData = jwtDecode(data.token);
          setUser(decodedUser);
        }
      } catch (error) {
        console.error("Error obteniendo token:", error);
      }
    };

    fetchUser();
  }, []); //El array vacío asegura que esto se ejecuta solo una vez al montar el componente

  return (
    <div className="h-full bg-white text-black">
      <Navbar />
      <div className="flex justify-end mt-20 mb-8 mx-4">
        <div className="flex flex-col items-end">
          <h1 className="font-bold">GESTIÓN ESTATAL</h1>
          <h4 className="text-sm">FORMULARIO DE RELEVAMIENTO DEL PREDIO</h4>
        </div>
        <div className="w-10 h-10 ml-4 flex justify-center items-center text-black bg-slate-200 text-xl">
          <p>1</p>
        </div>
      </div>
      <CuiComponent
        initialCui={selectedCui}
        onCuiInputChange={() => {}}
        isReadOnly={true}
        label="COMPLETE UN ÚNICO FORMULARIO N°1 CORRESPONDIENTE AL PREDIO QUE ESTÁ RELEVANDO"
        sublabel=""
      />
      <div className="flex mt-2 mx-10 p-2 border items-center justify-center gap-4">
        <div className=" flex gap-4 items-center justify-center w-1/2 h-1/2 border bg-slate-200 p-2 font-bold text-sm">
          <p>Censista</p>
          <p>Nombre y apellido:</p>
          <p>
            {user?.nombre} {user?.apellido}
          </p>
          <p>Dni:</p>
          <p>34.835.912</p>
        </div>
      </div>
      <VisitasComponent />
      <RespondientesDelCuiComponent />
      <EstablecimientosPrivados />
    </div>
  );
}
