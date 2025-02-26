import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextInput from "./dinamicForm/TextInput";

export default function ObservacionesComponent() {

  const [observaciones, setObservaciones] = useState("");
  const router = useRouter();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setObservaciones(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Observaciones:", observaciones);
    // Aquí puedes enviar las observaciones a donde necesites
    // (por ejemplo, a una API o a otro componente)
    setObservaciones(""); // Resetea el TextInput
    toast.success("Observaciones enviadas correctamente."); // Muestra el toast
    router.push("/relevamiento-predio"); // Redirige a la nueva página
  };

  return (
    <div className="mx-10">
      <div className="flex flex-col mt-2 p-2 border w-96">
        <div className="bg-slate-200 p-2 justify-center text-center items-center">
          <p className="text-lg font-bold ml-4">OBSERVACIONES</p>
        </div>
        <form onSubmit={handleSubmit}>
          <TextInput label={""} subLabel={""} value={observaciones} onChange={handleInputChange} />
          <div className="flex mt-2 justify-end">
            <button
              type="submit"
              className="bg-slate-200 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded"
            >
              Cargar información
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
