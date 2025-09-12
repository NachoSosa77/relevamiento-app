/* eslint-disable react-hooks/exhaustive-deps */
import { useRelevamientoId } from "@/hooks/useRelevamientoId";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setArchivosSubidos } from "@/redux/slices/archivoSlice";
import {
  setCantidadConstrucciones,
  setSuperficieTotalPredio,
} from "@/redux/slices/espacioEscolarSlice";
import { useEffect, useState } from "react";
import PlanoSkeleton from "../Skeleton/PlanSkeleton";
import Check from "../ui/Checkbox";
import DecimalNumericInput from "../ui/DecimalNumericInput";
import FileUpload from "../ui/FileUpLoad";
import NumericInput from "../ui/NumericInput";

export default function PlanoComponent() {
  const [showComponents, setShowComponents] = useState<boolean | null>(null);
  const [siChecked, setSiChecked] = useState(false);
  const [noChecked, setNoChecked] = useState(false);
  const [editando, setEditando] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 👈 nuevo

  const dispatch = useAppDispatch();
  const superficieTotalPredio = useAppSelector(
    (state) => state.espacio_escolar.superficieTotalPredio
  );
  const cantidadConstrucciones = useAppSelector(
    (state) => state.espacio_escolar.cantidadConstrucciones
  );
  const relevamientoId = useRelevamientoId();

  const handleSiChange = (checked: boolean) => {
    if (checked) {
      setSiChecked(true);
      setNoChecked(false);
      setShowComponents(true);
    } else {
      setSiChecked(false);
      setShowComponents(null);
    }
  };

  const handleNoChange = (checked: boolean) => {
    if (checked) {
      setNoChecked(true);
      setSiChecked(false);
      setShowComponents(false);
    } else {
      setNoChecked(false);
      setShowComponents(null);
    }
  };

  const handleCantidadConstruccionesChange = (value: number | undefined) => {
    dispatch(setCantidadConstrucciones(value));
  };

  const handleSuperficieTotalPredioChange = (value: number | undefined) => {
    dispatch(setSuperficieTotalPredio(value));
  };

  useEffect(() => {
  const fetchDatosPlano = async () => {
    if (!relevamientoId) return;

    try {
      // Obtener datos del plano
      const res = await fetch(`/api/espacios_escolares/${relevamientoId}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data) {
        dispatch(setCantidadConstrucciones(data.cantidad_construcciones));
        dispatch(setSuperficieTotalPredio(data.superficie_total_predio));
        setEditando(true);

        // Inferir estado visual de los checkboxes
        if (
          data.superficie_total_predio !== null &&
          data.superficie_total_predio !== undefined
        ) {
          setSiChecked(true);
          setNoChecked(false);
          setShowComponents(true);
        } else {
          setNoChecked(true);
          setSiChecked(false);
          setShowComponents(false);
        }
      }

      // Obtener archivos del relevamiento
      const resArchivos = await fetch(
        `/api/archivos?relevamientoId=${relevamientoId}`
      );
      const dataArchivos = await resArchivos.json();

      if (dataArchivos?.archivos) {
        dispatch(setArchivosSubidos(dataArchivos.archivos));
      }
    } catch (error) {
      console.error("Error al cargar datos del plano o archivos:", error);
    } finally {
      setIsLoading(false); // ✅ Solo después de todo
    }
  };

  fetchDatosPlano();
}, [relevamientoId]);


  // 👉 Spinner antes del return principal
  if (isLoading) return <PlanoSkeleton />;

  return (
    <div className="mx-8 my-6 space-y-6">
      {/* Intro */}

      <div className="bg-gray-50 p-2 rounded-2xl border shadow-sm">
        <p className="text-xs text-gray-600">
          En esta planilla se registran datos de todas las construcciones, los
          locales y las áreas exteriores del predio.
        </p>
      </div>
      {editando && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mt-2 rounded text-sm">
          Estás editando un registro ya existente.
        </div>
      )}

      {/* Paso 1 */}
      <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-custom text-white flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <p className="text-sm font-semibold text-gray-700">
            ¿Corresponde actualizar o realizar planos?
          </p>
        </div>
        <div className="flex flex-col justify-between items-center flex-wrap gap-4">
          <div className="flex gap-4 items-center">
            <Check label="Sí" checked={siChecked} onChange={handleSiChange} />
            <Check label="No" checked={noChecked} onChange={handleNoChange} />
          </div>
          <FileUpload relevamientoId={relevamientoId} />
        </div>
      </div>

      {/* Aclaraciones */}
      <div className="bg-gray-50 p-4 rounded-2xl border shadow-sm space-y-2">
        <p className="text-xs text-gray-600">
          Indique <strong>SI</strong> si se trata de un edificio del sistema
          educativo de gestión estatal.
        </p>
        <p className="text-xs text-gray-600">
          Indique <strong>NO</strong> si se trata de CUE-Anexos en edificios de
          instituciones no escolares cedidos por el sector privado.
        </p>
        <p className="text-xs text-gray-600">
          Si responde <strong>SI</strong>, complete todos los ítems. Si responde{" "}
          <strong>NO</strong>, complete únicamente: cantidad de construcciones,
          tipo y superficie de áreas exteriores, y tipo/superficie de los
          locales usados por el CUE-Anexo.
        </p>
      </div>

      {/* Paso 2 y 3 */}
      {(showComponents === true || editando) && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-custom text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Superficie total del predio
              </p>
            </div>
            <DecimalNumericInput
              label=""
              value={superficieTotalPredio}
              subLabel="m2 O-NS"
              onChange={handleSuperficieTotalPredioChange}
              disabled={false}
            />
          </div>

          <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-custom text-white flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Construcciones en el predio
              </p>
            </div>
            <NumericInput
              label=""
              value={cantidadConstrucciones}
              subLabel=""
              onChange={handleCantidadConstruccionesChange}
              disabled={false}
            />
          </div>
        </div>
      )}

      {/* Solo paso 3 si eligió "NO" */}
      {(showComponents === false || editando) && (
        <div className="bg-white p-4 rounded-2xl border shadow-md flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-custom text-white flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <p className="text-sm font-semibold text-gray-700">
              Cantidad de construcciones en el predio
            </p>
          </div>
          <NumericInput
            label=""
            value={cantidadConstrucciones}
            subLabel=""
            onChange={handleCantidadConstruccionesChange}
            disabled={false}
          />
        </div>
      )}
    </div>
  );
}
