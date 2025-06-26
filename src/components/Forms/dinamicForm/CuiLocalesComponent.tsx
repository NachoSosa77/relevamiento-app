/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { LocalDetalleModal } from "@/components/Detalles/LocalesConstruccion";
import Spinner from "@/components/ui/Spinner";
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { LocalesConstruccion } from "@/interfaces/Locales";
import { localesService } from "@/services/localesServices";
import { relevamientoService } from "@/services/relevamientoService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CuiLocalesComponentProps {
  label: string;
  sublabel: string;
  onLocalSelected: (local: LocalesConstruccion | null) => void;
  isReadOnly: boolean;
}

const CuiLocalesComponent: React.FC<CuiLocalesComponentProps> = ({
  label,
  sublabel,
  onLocalSelected,
  isReadOnly,
}) => {
  const [locales, setLocales] = useState<LocalesConstruccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLocales, setLoadingLocales] = useState(true);
  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocalId, setSelectedLocalId] = useState<number | undefined>(
    undefined
  );
  const [relevamientoGuardado, setRelevamientoGuardado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [localSeleccionado, setLocalSeleccionado] =
    useState<LocalesConstruccion | null>(null);

  const router = useRouter();
  const relevamientoId = useRelevamientoId();

  useEffect(() => {
    if (relevamientoId === undefined || relevamientoId === null) return;
  if (!relevamientoId) {
    toast.error(
      "No se encontró el ID del relevamiento. Por favor, regrese al inicio."
    );
    return;
  }
  const fetchLocales = async () => {
    try {
      const response = await localesService.getLocalesPorRelevamiento(
        relevamientoId
      );
      setLocales(response.locales || []);
    } catch (err) {
      setError("Error al obtener los locales");
    } finally {
      setLoadingLocales(false);
    }
  };

  if (relevamientoId) {
    fetchLocales();
  }
}, [relevamientoId, router]);


  const handleVerDetalle = async (local: LocalesConstruccion) => {
    try {
      const response = await fetch(`/api/locales_por_construccion/${local.id}`);
      const data = await response.json();
      setLocalSeleccionado(data.local);
      setShowModal(true);
    } catch (error) {
      console.error("Error al obtener detalle del local:", error);
      toast.error("Error al cargar la información del local");
    }
  };

  // Separar locales en completos e incompletos para mostrar en dos tablas
  const localesCompletos = locales.filter((l) => l.estado === "completo");
  const localesIncompletos = locales.filter((l) => l.estado !== "completo");
  const todosCompletos = localesIncompletos.length === 0;

  const handleLocalSelect = (local: LocalesConstruccion) => {
    setSelectedLocalId(local.id);
    onLocalSelected(local);
    router.push(`/relevamiento-locales/detalle-local/${local.id}`);
  };

  const handleGuardarRelevamiento = async () => {
  if (!relevamientoId) {
    toast.error("No se encontró el ID del relevamiento");
    return;
  }

  setLoadingGuardar(true);

  try {
    await relevamientoService.updateEstadoRelevamiento(
      relevamientoId,
      "completo"
    );
    toast.success("Relevamiento marcado como completo");
    setRelevamientoGuardado(true);
    sessionStorage.removeItem("relevamientoId");

    router.push("/home");
  } catch (error) {
    console.error(error);
    toast.error("Error al actualizar estado del relevamiento");
  } finally {
    setLoadingGuardar(false);
  }
};


  if (loadingLocales)
    return (
      <div className="items-center justify-center">
        <Spinner />
      </div>
    );
  if (error) return <p className="mx-10 text-red-500">{error}</p>;

  return (
    <div className="mx-10 p-4 border rounded-2xl shadow-lg bg-white text-sm">
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-gray-500 mb-4">{sublabel}</p>

      {/* Tabla locales incompletos */}
      <div>
        <h3 className="mb-2 font-semibold text-red-600">Locales incompletos</h3>
        {localesIncompletos.length === 0 ? (
          <p className="text-gray-500">No hay locales incompletos.</p>
        ) : (
          <table className="w-full mb-6 border text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border px-2 py-1 text-center">Cui</th>
                <th className="border px-2 py-1 text-center">
                  N° Construcción
                </th>
                <th className="border px-2 py-1 text-center">N° Planta</th>

                <th className="border px-2 py-1 text-center">N° Local</th>
                <th className="border px-2 py-1 text-center">Tipo local</th>
                <th className="border px-2 py-1 text-center">Estado</th>
                <th className="border px-2 py-1 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {localesIncompletos.map((local) => (
                <tr
                  key={local.id}
                  className={local.id === selectedLocalId ? "bg-custom/50" : ""}
                >
                  <td className="border px-2 py-1 text-center">
                    {local.cui_number}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    C {local.numero_construccion}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    P {local.numero_planta}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    L {local.identificacion_plano}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {local.nombre_local}
                  </td>
                  <td className="border px-2 py-1 text-center text-red-600 font-bold">
                    Incompleto
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => {
                        handleLocalSelect(local);
                      }}
                      disabled={isReadOnly}
                      className={`px-3 py-1 rounded text-white ${
                        isReadOnly
                          ? "bg-gray-400"
                          : "bg-custom hover:bg-custom/50"
                      }`}
                    >
                      Completar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tabla locales completos */}
      <div>
        <h3 className="mb-2 font-semibold text-green-600">Locales completos</h3>
        {localesCompletos.length === 0 ? (
          <p className="text-gray-500">No hay locales completos.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-green-100">
              <tr>
                <th className="border px-2 py-1 text-center">Cui</th>
                <th className="border px-2 py-1 text-center">
                  N° Construcción
                </th>
                <th className="border px-2 py-1 text-center">
                  N° Planta
                </th>
                <th className="border px-2 py-1 text-center">
                  N° Local
                </th>
                <th className="border px-2 py-1 text-center">Tipo local</th>
                <th className="border px-2 py-1 text-center">Estado</th>
                <th className="border px-2 py-1 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {localesCompletos.map((local) => (
                <tr
                  key={local.id}
                  className={
                    local.id === selectedLocalId ? "bg-yellow-100" : ""
                  }
                >
                  <td className="border px-2 py-1 text-center">
                    {local.cui_number}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    C {local.numero_construccion}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    P {local.numero_planta}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    L {local.identificacion_plano}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {local.nombre_local}
                  </td>
                  <td className="border px-2 py-1 text-center text-green-600 font-bold">
                    Completo ✔️
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => handleVerDetalle(local)}
                      className={`px-3 py-1 rounded text-white ${
                        isReadOnly
                          ? "bg-gray-400"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showModal && localSeleccionado && (
          <LocalDetalleModal
            local={localSeleccionado}
            onClose={() => setShowModal(false)}
            isOpen={showModal}
          />
        )}
      </div>

      <button
  disabled={!todosCompletos || relevamientoGuardado || loadingGuardar}
  onClick={handleGuardarRelevamiento}
  className="mt-4 px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
>
  {loadingGuardar
    ? "Guardando..."
    : relevamientoGuardado
    ? "Relevamiento guardado ✔️"
    : "Guardar Relevamiento"}
</button>
    </div>
  );
};

export default CuiLocalesComponent;
