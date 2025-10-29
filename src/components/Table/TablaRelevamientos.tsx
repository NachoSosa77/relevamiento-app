"use client";

import { Relevamiento } from "@/interfaces/Relevamiento";
import { useAppDispatch } from "@/redux/hooks";
import { setRelevamientoId } from "@/redux/slices/espacioEscolarSlice";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "../ui/Spinner";

export default function TablaRelevamientos() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); // ← comienza en true
  const [relevamientos, setRelevamientos] = useState<Relevamiento[]>([]);

  useEffect(() => {
    const fetchRelevamientos = async () => {
      try {
        const res = await fetch("/api/relevamientos/usuario", {
          credentials: "include",
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setRelevamientos(data);
        } else {
          console.error("Error:", data);
          setRelevamientos([]);
        }
      } catch (error) {
        console.error("Error al cargar relevamientos:", error);
        setRelevamientos([]);
      } finally {
        setLoading(false); // ← ahora sí al final
      }
    };

    fetchRelevamientos();
  }, []);

  const handleEditar = (id: number) => {
    dispatch(setRelevamientoId(id));
    sessionStorage.setItem("relevamientoId", String(id));
    router.push(`/home/relevamiento/detalle/${id}`);
  };

  const handleView = (id: number) => {
    router.push(`/home/relevamiento/detalle/${id}`);
  };

  const handleViewPdf = (id: number) => {
    router.push(`/home/pdf/${id}`);
  };

  // 🔽 Spinner
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="mx-10 mt-6">
      <h2 className="text-xl font-semibold mb-4">Mis relevamientos</h2>
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
              ID
            </th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
              CUI
            </th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
              Usuario
            </th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
              Fecha
            </th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
              Estado
            </th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {relevamientos.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-center text-sm">{r.id}</td>
              <td className="px-4 py-2 text-center text-sm">{r.cui_id}</td>
              <td className="px-4 py-2 text-center text-sm">{r.created_by}</td>
              <td className="px-4 py-2 text-center text-sm">
                {format(new Date(r.created_at), "dd/MM/yyyy HH:mm", {
                  locale: es,
                })}
              </td>
              <td className="px-4 py-2 text-center text-sm">
                {r.estado === "incompleto" ? (
                  <span className="text-yellow-600 font-semibold">
                    Incompleto
                  </span>
                ) : r.estado === "completo" ? (
                  <span className="text-green-600 font-semibold">Completo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Cancelado</span>
                )}
              </td>
              <td className="px-4 py-2 text-center flex justify-center gap-2">
                <button
                  onClick={() => handleView(r.id)}
                  className="bg-yellow-600 text-white font-bold px-4 py-1 rounded hover:bg-yellow-600/50"
                >
                  Ver detalle
                </button>
                <button
                  onClick={() => handleEditar(r.id)}
                  className="bg-custom text-white font-bold px-4 py-1 rounded hover:bg-custom/50"
                >
                  Editar / Continuar
                </button>
                                <button
                  onClick={() => handleViewPdf(r.id)}
                  className="bg-green-600 text-white font-bold px-4 py-1 rounded hover:bg-green-600/50"
                >
                  Ver Informe Pdf
                </button>

              </td>
            </tr>
          ))}
          {relevamientos.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="text-center py-4 text-sm text-gray-500"
              >
                No hay relevamientos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
