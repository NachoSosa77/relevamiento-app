import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextInput from "./dinamicForm/TextInput";

export default function ObservacionesComponent() {

  const [observaciones, setObservaciones] = useState("");
  const router = useRouter();

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setObservaciones(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Aquí puedes enviar las observaciones a donde necesites
    // (por ejemplo, a una API o a otro componente)
    setObservaciones(""); // Resetea el TextInput
    toast.success("Observaciones enviadas correctamente."); // Muestra el toast
    router.push("/relevamiento-predio"); // Redirige a la nueva página
  };

  return (
    <div className="mx-8 my-6 border rounded-2xl">
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-gray-700">
            OBSERVACIONES
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <TextInput value={observaciones} onChange={handleInputChange} />
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
    </div>
  );
}
