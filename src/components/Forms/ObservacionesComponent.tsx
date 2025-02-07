import TextInput from "./dinamicForm/TextInput";

export default function ObservacionesComponent() {
    return (
    <div className="mx-10">
        <div className="flex flex-col mt-2 p-2 border w-96">
          <div className="bg-slate-200 p-2 justify-center text-center items-center">
            <p className="text-lg font-bold ml-4">OBSERVACIONES</p>
          </div>
          <form action="">
          <TextInput label={""} subLabel={""} value={""} onChange={() => { }} />
            <div className="flex mt-2 justify-end">
              <button type="submit" className="bg-slate-200 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded">
                Cargar información
              </button>
            </div>
          </form>
      </div>
    </div>
)
}
