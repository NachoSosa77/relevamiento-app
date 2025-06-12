"use client";

export default function FormularioGeneralPage() {
  return (
    <div className="h-full mt-8 overflow-hidden bg-white text-black text-sm">
      <div className="flex justify-center mt-20 mb-8 mx-4">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-black">
            PLANILLA GENERAL DE RELEVAMIENTO PEDAGÓGICO
          </h1>
        </div>
      </div>
      {/*ParteA*/}
      <div className="p-4 mx-12 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>A</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">CUI (Código Único de Infraestructura)</p>
          </div>
          <div className="ml-auto flex items-center">
            <p className="font-bold mr-4">Ingresa el número de CUI:</p>
            <div className="border rounded-lg p-4 w-52"></div>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-xs text-gray-600">
            Transcriba de la hoja de ruta el número de CUI
          </p>
        </div>
      </div>
      {/*ParteB*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>B</p>
          </div>
          <div>
            <p className="font-bold ml-4">
              CUE-ANEXO DE LOS ESTABLECIMIENTOS DEL O LOS DIRECTIVOS
              RESPONDENTES
            </p>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-600">
            Transcriba de la hoja de ruta el domicilio postal del CUE-Anexos del
            o los directivos respondientes. Si es necesario utilice la columna
            Referencia para especificar el domicilio.
          </p>
        </div>
        <table className="w-full text-center rounded-xl border border-gray-200 overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border p-2">Calle</th>
              <th className="border p-2">Número</th>
              <th className="border p-2">Referencia</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr className="border-b">
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
          </tbody>
        </table>
        <table className="mt-2 w-full text-center rounded-xl border border-gray-200 overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border p-2">Provincia</th>
              <th className="border p-2">Departamento</th>
              <th className="border p-2">localidad/paraje</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/*ParteC*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>1</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">
              CORRESPONDE ACTUALIZAR O REALIZAR PLANOS
            </p>
          </div>
          <div className="ml-auto flex items-center">
            <p className="font-bold mr-4">Si</p>
            <div className="border rounded-lg p-4"></div>
            <p className="font-bold mx-4">No</p>
            <div className="border rounded-lg p-4"></div>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-xs text-gray-600">
            Indique SI si se trata de un edificio del sistema educativo de
            gestión estatal. Indique NO si se trata de CUE-Anexos que funcionan
            en un edificio de una institución no escolar o un edificio escolar
            cedido por el sector de gestión privada. Si contestó SI complete la
            totalidad de los items. Si contestó NO complete exclusivamente los
            siguientes campos: cantidad de construcciones (sólo si el CUE-Anexo
            hace uso de al menos una construcción completa), tipo y superficie
            de las áreas exteriores y tipo y superficie de los locales por
            construcción (sólo de los que usa el CUE-Anexo).
          </p>
        </div>
      </div>
      {/*ParteD*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>2</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">SUPERFICIE TOTAL DEL PREDIO</p>
          </div>
          <div className="border rounded-lg ml-4 p-4 w-48"></div>
        </div>
      </div>
      {/*ParteE*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>3</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">CANTIDAD DE CONSTRUCCIONES EN EL PREDIO</p>
          </div>
          <div className="border rounded-lg ml-4 p-4 w-48"></div>
        </div>
      </div>
    </div>
  );
}
