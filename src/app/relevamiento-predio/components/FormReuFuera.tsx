import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormValues {
  question: string;
  setMostrarFuera: (value: boolean) => void;
  onConfirm: () => void; // Nueva función para ejecutar después de enviar datos
}

const FormReuFuera: React.FC<FormValues> = ({ setMostrarFuera, question, onConfirm }) => {
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const router = useRouter(); // Inicializar useRouter

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    if (name === "question" && value === "Si") {
      setMostrarFuera(true);
      setShowConfirmButton(false);
    } else if (name === "question" && value === "No") {
      setMostrarFuera(false);
      setShowConfirmButton(true);
    }
  };

  const handleConfirmNo = async () => {
    try {
      await axios.post("/api/obras_fuera_predio", { // Cambiar el endpoint
        tipo_obra: "Sin obras fuera del predio",
        domicilio: "Sin obras fuera del predio",
        cue: null,
        destino: "Sin obras fuera del predio",
      });
      toast.success("Datos enviados correctamente");
      setShowConfirmButton(false);
      onConfirm(); // Llamar a la función onConfirm después de enviar datos
      router.push("/relevamiento-construcciones"); // Redirigir a /relevamiento-construcciones
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.error("Hubo un error al enviar los datos");
    }
  };

  return (
    <div className="flex p-4 mx-10 items-center justify-center">
      <ToastContainer />
      <form className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <label
            htmlFor="question"
            className="border p-2 bg-slate-200 justify-center items-center"
          >
            {question}
          </label>
          <div className="flex items-center p-2 gap-2 text-sm font-bold ">
            <label>
              <input
                className="mr-2"
                type="radio"
                name="question"
                value="Si"
                onChange={handleChange}
              />
              Sí
            </label>
            <label>
              <input
                className="mr-2"
                type="radio"
                name="question"
                value="No"
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        {showConfirmButton && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleConfirmNo}
              className="text-sm font-bold bg-red-500 text-white p-4 rounded-md flex-nowrap"
            >
              ¿Confirma que no existen obras fuera del predio?
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormReuFuera;
