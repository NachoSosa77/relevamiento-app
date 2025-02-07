import { FormEvent, useState } from "react";
import Select from "../ui/SelectComponent";

interface FormValues {
  question: string;
}

const FormReutilizable: React.FC<FormValues> = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    question: " ",
  });
  const [showMoreFields, setShowMoreFields] = useState(false);
  
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormValues({ ...formValues, [name]: value });
    if (name === "question" && value === "si") {
      setShowMoreFields(true);
    } else {
      setShowMoreFields(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(formValues);
  };

  return (
    <div className="grid items-center justify-center gap-4 p-4 border">
      <form onSubmit={handleSubmit} className="flex">
        <div>
          <div className="w-10 h-10 p-4 flex justify-center items-center border text-black font-bold bg-slate-200">
              <p>B1</p>
          </div>
          <label htmlFor="question" className="border p-2 bg-slate-200">Este CUE-Anexo ¿Funciona en el edificio de una institución no escolar o en un edificio escolar cedido por el sector de gestión privada?</label>
          <div className="flex items-center p-2 gap-2 text-sm font-bold ">
                  <label>
                      <input
                      className="mr-2"
                      type="radio"
                      name="question"
                      value="si"
                      checked={formValues.question === 'si'}
                      onChange={handleChange}
                      />
                      Sí
                  </label>
                  <label>
                      <input
                      className="mr-2"
                      type="radio"
                      name="question"
                      value="no"
                      checked={formValues.question === 'no'}
                      onChange={handleChange}
                      />
                      No
                  </label>
          </div>
        </div>
        <div>
          {showMoreFields && (
            <div className="">
              <div className="w-10 h-10 p-4 flex justify-center items-center border text-black font-bold bg-slate-200">
              <p>B2</p>
              </div>
              <label htmlFor="question" className="border p-2 bg-slate-200">¿De qué tipo de institución se trata?</label>
              <div className="flex items-center p-2 gap-2 text-sm font-bold ">
                      <Select label="" value={""} options={[]} onChange={()=>{}}/>
              </div>
            </div>
          )}
        </div>

        
        {/* <div>
        <button type="submit">Enviar</button>
        </div> */}
      </form>
    </div>

  );
};

export default FormReutilizable;
