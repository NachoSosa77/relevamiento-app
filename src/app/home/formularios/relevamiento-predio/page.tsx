"use client";

export default function FormularioPredioPage() {
  return (
    <div className="h-full mt-8 overflow-hidden bg-white text-black text-sm">
      <div className="flex justify-center mt-20 mb-8 mx-4">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-black">
            FORMULARIO DE RELEVAMIENTO DEL PREDIO 1
          </h1>
        </div>
      </div>
      <div className="flex flex-col mx-12 mb-2 justify-start">
        <h1 className="font-bold text-black">
          COMPLETE UN ÚNICO FORMULARIO N°1 CORRESPONDIENTE AL PREDIO QUE ESTÁ
          RELEVANDO
        </h1>
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
          <div>
            <p className="font-bold ml-4">CENCISTA</p>
          </div>
        </div>
        <table className="w-full mt-2 text-center rounded-xl border border-gray-200 overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border p-2">Nombre y apellido</th>
              <th className="border p-2">Dni</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/*ParteC*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="ml-4">
            <p className="font-bold">
              VISITAS REALIZADAS PARA COMPLETAR EL CENSO
            </p>
          </div>
        </div>
        <table className="w-full mt-2 text-center rounded-xl border border-gray-200 overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border p-2">N° de visita</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Hora de inicio</th>
              <th className="border p-2">Hora finalización</th>
              <th className="border p-2">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/*ParteD*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="ml-4">
            <p className="font-bold">RESPONDENTES DEL CUI</p>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-600">
            Registre nombre, apellido y cargo, denominación del establecimiento
            educativo y teléfono de contacto del o los directivos respondentes
            del CUI.
          </p>
        </div>

        <table className="w-full mt-2 text-center rounded-xl border border-gray-200 overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border p-2">Nombre y apellido</th>
              <th className="border p-2">Cargo</th>
              <th className="border p-2">
                Denominación del establecimiento educativo
              </th>
              <th className="border p-2">Teléfono de contacto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/*ParteE*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>B</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">
              ESTABLECIMIENTOS EN EDIFICIOS NO ESCOLARES O EDIFICIOS ESCOLARES
              CEDIDOS POR EL SECTOR PRIVADO
            </p>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>B1</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">
              Este establecimiento ¿funciona en el edificio de una institución
              no escolar o en un edificio escolar cedido por el sector de
              gestión privada?
            </p>
          </div>
          <div className="ml-auto flex items-center">
            <p className="font-bold mr-4">Si</p>
            <div className="border rounded-lg p-4"></div>
            <p className="font-bold mx-4">No</p>
            <div className="border rounded-lg p-4"></div>
          </div>
          <div className="ml-2 text-xs text-gray-600">
            <p>Si: Pase al ítem B.2 No: Pase al ítem C</p>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>B2</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">
              ¿De qué tipo de institución se trata? (Lea todas las opciones de
              respuesta).
            </p>
          </div>
          <div className="ml-auto flex items-center">
            <p className="font-bold mr-4">Código</p>
            <div className="border rounded-lg p-4"></div>
            <p className="text-xs px-2 text-gray-600">Descripción</p>
            <p className="text-xs text-gray-600">
              A-Cárcel B-Hospital C-Centro de salud D-Comedor comunitario
              E-Sindicato F-Sociedad de fomento G-Club H- Edificio de gestión
              privada (cedido) I-Otro
            </p>
          </div>
        </div>
        <div className=" flex items-center ml-10 mt-1">
          <p>Otro. Indique: </p>
          <div className="ml-auto border rounded-lg p-4 w-48"></div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>B3</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">¿Cuál es el nombre de la Institución?</p>
          </div>
          <div className="ml-auto flex items-center">
            <div className="border rounded-lg p-4 w-48"></div>
          </div>
        </div>
        <div className="ml-2 mt-2 text-xs text-gray-600">
          <p>
            Si se trata de un Establecimiento que funciona en un edificio no
            escolar o en un edificio escolar cedido por el sector privado,
            deberán relevarse exclusivamente los ítems C, D y 6 (en caso de que
            el Establecimiento utilice áreas exteriores).
          </p>
        </div>
      </div>
      {/*ParteF*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>C</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">
              ESTABLECIMIENTOS QUE FUNCIONAN EN EL PREDIO
            </p>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <p className="text-xs text-gray-600">
            Transcriba de la hoja de ruta la denominación de los
            establecimientos educativos que funcionan en el predio y el Número
            de Establecimiento de cada uno de ellos. En caso de que el directivo
            mencione un Establecimiento usuario que no está consignado en la
            Hoja de ruta, se deberá agregar, completando los datos
            correspondientes.
          </p>
        </div>
        <table className="w-full text-center rounded-xl border border-gray-200 overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border p-2">Denominación del establecimiento</th>
              <th className="border p-2">Establecimiento</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr>
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
            <tr className="border-b">
              <td className="border py-4">{/* Celda vacía */}</td>
              <td className="border py-4">{/* Celda vacía */}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/*ParteG*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>1</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">SITUACIÓN DE DOMINIO</p>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>1.1</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">
              ¿Cuál es la situación de dominio de este predio? (Lea las opciones
              de respuesta)
            </p>
          </div>
          <div className="ml-auto flex items-center">
            <p className="font-bold mr-4">Código</p>
            <div className="border rounded-lg p-4"></div>
            <p className="text-xs px-2 text-gray-600">Descripción</p>
            <p className="text-xs text-gray-600">
              A-Propiedad fiscal B-Alquilado C-En préstamo D-No sabe E- Otra
              situación
            </p>
          </div>
        </div>
        <div className=" flex items-center ml-10 mt-1">
          <p>Otra situación. Indique: </p>
          <div className="ml-auto border rounded-lg p-4 w-48"></div>
        </div>

        <div className="flex items-center mt-2">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>1.2</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">
              ¿Existe algún juicio en curso con respecto a la tenencia de este
              predio?
            </p>
          </div>
          <div className="ml-auto flex items-center">
            <p className="font-bold mr-4">Si</p>
            <div className="border rounded-lg p-4"></div>
            <p className="font-bold mx-4">No</p>
            <div className="border rounded-lg p-4"></div>
            <p className="font-bold mx-4">Ns</p>
            <div className="border rounded-lg p-4"></div>
          </div>
        </div>
      </div>
      {/*ParteG*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="mt-2 items-center">
          <p className="text-xs text-gray-600">
            Pregunte si los servicios listados están disponibles en el predio.
            En caso de respuesta afirmativa, indique &quot;si&quot; y pase al
            ítem siguiente. En caso de respuesta negativa, indique
            &quot;no&quot; y pregunte si el servicio se encuentra disponible en
            un radio de 1km. En caso de respuesta afirmativa, pregunte ¿A qué
            distancia del predio (en m.) está disponible el servicio? En caso de
            respuesta negativa, indique &quot;no&quot; y pase al ítem siguiente.
          </p>
        </div>
      </div>
            {/*ParteF*/}
      <div className="p-4 mx-12 mt-4 border rounded-2xl shadow-lg bg-white text-black">
        <div className="flex items-center">
          <div className="w-6 h-6 flex justify-center items-center bg-black rounded-full text-white font-bold">
            <p>2</p>
          </div>
          <div className="ml-4">
            <p className="font-bold">
              SERVICIOS BÁSICOS
            </p>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <p className="text-xs text-gray-600">
            Para registrar el ítem 2.3 sólo pregunte si el servicio se presta de manera discontinua.
          </p>
        </div>
        <table className="w-full text-center rounded-xl border border-gray-200 overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-black">
                <th className="border p-2">{" "}</th>
                <th className="border p-2"></th>
              <th className="border p-2">En el predio</th>
              <th className="border p-2">En la zona (1 km de radio)</th>
              <th className="border p-2">Distancia al predio (en m.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border py-4 text-center justify-center">2.1</td>
              <td className="border py-4">Alumbrado público</td>
              <td className="border py-4"><div className="flex justify-around"><p>Si</p><p>No</p></div></td>
              <td className="border py-4"><div className="flex justify-around"><p>No</p><p>Si</p></div></td>
              <td className="border py-4"><div className="flex ml-2 justify-around items-center gap-2"><div className="ml-auto border rounded-lg p-4 w-1/2"></div><p className="items-center">NS</p><div className="ml-auto border rounded-lg p-4 w-1/2"></div></div></td>
            </tr>
            <tr>
              <td className="border py-4 text-center justify-center">2.2{/* Celda vacía */}</td>
              <td className="border py-4">Electricidad de Red</td>
              <td className="border py-4"><div className="flex justify-around"><p>Si</p><p>No</p></div></td>
              <td className="border py-4"><div className="flex justify-around"><p>No</p><p>Si</p></div></td>
              <td className="border py-4"><div className="flex ml-2 justify-around items-center gap-2"><div className="ml-auto border rounded-lg p-4 w-1/2"></div><p className="items-center">NS</p><div className="ml-auto border rounded-lg p-4 w-1/2"></div></div></td>
            </tr>
            <tr>
              <td className="border py-4 text-center justify-center">2.3{/* Celda vacía */}</td>
              <td className="border py-4">Gas natural de red</td>
              <td className="border py-4"><div className="flex justify-around"><p>Si</p><p>No</p></div></td>
              <td className="border py-4"><div className="flex justify-around"><p>No</p><p>Si</p></div></td>
              <td className="border py-4"><div className="flex ml-2 justify-around items-center gap-2"><div className="ml-auto border rounded-lg p-4 w-1/2"></div><p className="items-center">NS</p><div className="ml-auto border rounded-lg p-4 w-1/2"></div></div></td>
            </tr>
            <tr className="border-b">
              <td className="border py-4 text-center justify-center">2.4{/* Celda vacía */}</td>
              <td className="border py-4">Agua corriente</td>
              <td className="border py-4"><div className="flex justify-around"><p>Si</p><p>No</p></div></td>
              <td className="border py-4"><div className="flex justify-around"><p>No</p><p>Si</p></div></td>
              <td className="border py-4"><div className="flex ml-2 justify-around items-center gap-2"><div className="ml-auto border rounded-lg p-4 w-1/2"></div><p className="items-center">NS</p><div className="ml-auto border rounded-lg p-4 w-1/2"></div></div></td>
            </tr>
            <tr className="border-b">
              <td className="border py-4 text-center justify-center">2.5{/* Celda vacía */}</td>
              <td className="border py-4">Red cloacal</td>
              <td className="border py-4"><div className="flex justify-around"><p>Si</p><p>No</p></div></td>
              <td className="border py-4"><div className="flex justify-around"><p>No</p><p>Si</p></div></td>
              <td className="border py-4"><div className="flex ml-2 justify-around items-center gap-2"><div className="ml-auto border rounded-lg p-4 w-1/2"></div><p className="items-center">NS</p><div className="ml-auto border rounded-lg p-4 w-1/2"></div></div></td>
            </tr>
            <tr className="border-b">
              <td className="border py-4 text-center justify-center">2.6{/* Celda vacía */}</td>
              <td className="border py-4">Planta de tratamiento de líquidos cloacales</td>
              <td className="border py-4"><div className="flex justify-around"><p>Si</p><p>No</p></div></td>
              <td className="border py-4"><p className="text-gray-600">No corresponde</p></td>
              <td className="border py-4"><p className="text-gray-600">No corresponde</p></td>
            </tr>
            <tr className="border-b">
              <td className="border py-4 text-center justify-center">2.7{/* Celda vacía */}</td>
              <td className="border py-4">Red de desagües pluviales</td>
              <td className="border py-4"><div className="flex justify-around"><p>Si</p><p>No</p></div></td>
              <td className="border py-4"><div className="flex justify-around"><p>No</p><p>Si</p></div></td>
              <td className="border py-4"><div className="flex ml-2 justify-around items-center gap-2"><div className="ml-auto border rounded-lg p-4 w-1/2"></div><p className="items-center">NS</p><div className="ml-auto border rounded-lg p-4 w-1/2"></div></div></td>
            </tr>
            <tr className="border-b">
              <td className="border py-4 text-center justify-center">2.8{/* Celda vacía */}</td>
              <td className="border py-4">Recolección de residuos</td>
              <td className="border py-4"><div className="flex justify-around"><p>Si</p><p>No</p></div></td>
              <td className="border py-4"><div className="flex justify-around"><p>No</p><p>Si</p></div></td>
              <td className="border py-4"><div className="flex ml-2 justify-around items-center gap-2"><div className="ml-auto border rounded-lg p-4 w-1/2"></div><p className="items-center">NS</p><div className="ml-auto border rounded-lg p-4 w-1/2"></div></div></td>
            </tr>
          </tbody>
        </table>
      </div>

      
    </div>
  );
}
