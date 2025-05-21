import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormValues {
  question: string;
  setMostrarObras: (value: boolean) => void;
  onConfirm: () => void;
}

const FormReu: React.FC<FormValues> = ({ setMostrarObras, question, onConfirm }) => {
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  )
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value === "Si") {
      setMostrarObras(true);
      setShowConfirmButton(false);
    } else if (value === "No") {
      setMostrarObras(false);
      setShowConfirmButton(true);
    }
  };

  const handleConfirmNo = async () => {
    try {
      await axios.post("/api/obras_en_predio", {
        tipo_obra: "Sin obras en el predio",
        estado: "Sin obras en el predio",
        financiamiento: "Sin obras en el predio",
        superficie_total: "Sin obras en el predio",
        destino: "Sin obras en el predio",
        relevamiento_id: relevamientoId,
      });
      toast.success("Datos enviados correctamente");
      setShowConfirmButton(false);
      onConfirm();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.error("Hubo un error al enviar los datos");
    }
  };

  return (
    <div className="mx-8 my-6 border rounded-2xl">
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
        <form className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <label className="text-base font-semibold text-gray-700">
              {question}
            </label>
            <div className="flex gap-4 text-sm font-medium text-gray-800">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="question"
                  value="Si"
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Sí
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="question"
                  value="No"
                  onChange={handleChange}
                  className="accent-blue-600"
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
                className="text-sm font-bold bg-red-600 hover:bg-red-700 transition-colors text-white px-5 py-3 rounded-lg"
              >
                ¿Confirma que no existen obras en el predio?
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormReu;
