import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormValues {
  question: string;
  setMostrarFuera: (value: boolean) => void;
  onConfirm: () => void;
}

const FormReuFuera: React.FC<FormValues> = ({
  setMostrarFuera,
  question,
  onConfirm,
}) => {
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // nuevo estado
  const relevamientoId = useRelevamientoId();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value === "Si") {
      setMostrarFuera(true);
      setShowConfirmButton(false);
    } else if (value === "No") {
      setMostrarFuera(false);
      setShowConfirmButton(true);
    }
  };

  const handleConfirmNo = async () => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/obras_fuera_predio", {
        tipo_obra: "Sin obras fuera del predio",
        domicilio: "Sin obras fuera del predio",
        cue: null,
        destino: "Sin obras fuera del predio",
        relevamiento_id: relevamientoId,
      });
      toast.success("Datos enviados correctamente");
      setShowConfirmButton(false);
      onConfirm();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.error("Hubo un error al enviar los datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-10 my-6 border rounded-2xl shadow-lg">
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
                disabled={isSubmitting}
                className={`text-sm font-bold px-5 py-3 rounded-lg transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isSubmitting
                  ? "Enviando..."
                  : "¿Confirma que no existen obras fuera del predio?"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormReuFuera;
