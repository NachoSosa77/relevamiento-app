/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppSelector } from "@/redux/hooks";
import { localesService } from "@/services/localesServices";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CuiLocalesComponentProps {
  label: string;
  sublabel: string;
  onLocalSelected: (local: any | null) => void;
  isReadOnly: boolean;
}

const CuiLocalesComponent: React.FC<CuiLocalesComponentProps> = ({
  label,
  sublabel,
  onLocalSelected,
  isReadOnly,
}) => {
  const [locales, setLocales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocal, setSelectedLocal] = useState<any | null>(null); // Para guardar el local seleccionado
  const [localesActualizados, setLocalesActualizados] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false); // Estado para saber si estamos en el cliente
  const router = useRouter(); // Hook de navegación

  useEffect(() => {
    setIsClient(true); // Actualizamos el estado cuando el componente esté montado en el cliente
  }, []);
  const relevamientoId = useAppSelector(
    (state) => state.espacio_escolar.relevamientoId
  );

  useEffect(() => {
    const fetchLocales = async () => {
      try {
        const response = await localesService.getLocalesPorRelevamiento(
          relevamientoId
        );
        setLocales(response.locales || []);
      } catch (err) {
        setError("Error al obtener los locales");
      } finally {
        setLoading(false);
      }
    };

    if (relevamientoId) {
      fetchLocales();
    }
  }, [relevamientoId]);

  useEffect(() => {
    const onStorageChange = () => {
      const actualizadosString = localStorage.getItem("localesActualizados");
      const actualizados = actualizadosString
        ? JSON.parse(actualizadosString).map(Number) // convertir a números acá
        : [];
      setLocalesActualizados(actualizados);
    };

    window.addEventListener("storage", onStorageChange);

    // También lo llamamos una vez para inicializar
    onStorageChange();

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  const handleLocalSelect = (local: any) => {
    setSelectedLocal(local);
    onLocalSelected(local);
    if (isClient) {
      // Verificamos que estamos en el cliente antes de hacer la navegación
      router.push(`/relevamiento-locales/detalle-local/${local.id}`); // Navegar al detalle usando el ID del local
    }
  };

  if (loading) return <p className="mx-10">Cargando locales...</p>;
  if (error) return <p className="mx-10 text-red-500">{error}</p>;

  return (
    <div className="mx-10">
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-gray-500 mb-2">{sublabel}</p>

      {locales.length === 0 ? (
        <p className="text-gray-500">
          No hay locales cargados para este relevamiento.
        </p>
      ) : (
        <table className="w-full mt-2 border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-center">Cui</th>
              <th className="border px-2 py-1 text-center">N° Construcción</th>
              <th className="border px-2 py-1 text-center">N° Planta</th>
              <th className="border px-2 py-1 text-center">N° Local</th>
              <th className="border px-2 py-1 text-center">Tipo local</th>
              <th className="border px-2 py-1 text-center"></th>
              {localesActualizados.length > 0 && (
                <th className="border px-2 py-1 text-center"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {locales.map((local) => (
              <tr key={local.id} className="">
                <td className="border px-2 py-1 text-center">
                  {local.cui_number}
                </td>
                <td className="border px-2 py-1 text-center">
                  L {local.numero_construccion}
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
                {localesActualizados.length > 0 && (
                  <td className="border px-2 py-1 text-center">
                    {localesActualizados.includes(local.id) ? (
                      <span className="text-green-500">✔️</span>
                    ) : (
                      <span className="text-red-500"></span>
                    )}
                  </td>
                )}
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => handleLocalSelect(local)}
                    disabled={isReadOnly}
                    className={`px-3 py-1 rounded text-white ${
                      isReadOnly
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Seleccionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CuiLocalesComponent;
