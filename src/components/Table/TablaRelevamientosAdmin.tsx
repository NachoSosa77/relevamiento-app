"use client";

import { Relevamiento } from "@/interfaces/Relevamiento";
import { useAppDispatch } from "@/redux/hooks";
import { setRelevamientoId } from "@/redux/slices/espacioEscolarSlice";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Spinner from "../ui/Spinner";

type AdminFilters = {
  fecha_desde?: string; // "YYYY-MM-DD"
  fecha_hasta?: string; // "YYYY-MM-DD"
  created_by?: string;
  cui?: string;
  estado?: string; // "incompleto" | "completo" | "pendiente" (ajusta a tus valores reales)
};

type Props = {
  filters?: AdminFilters;
  pageSize?: number;
};

export default function TablaRelevamientosAdmin({
  filters = {},
  pageSize = 25,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [relevamientos, setRelevamientos] = useState<Relevamiento[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  // Por defecto: últimos 30 días si no vienen filtros
  const effectiveFilters = useMemo(() => {
    if (filters.fecha_desde && filters.fecha_hasta) return filters;
    const d = new Date();
    const hasta = d.toISOString().slice(0, 10);
    d.setDate(d.getDate() - 30);
    const desde = d.toISOString().slice(0, 10);
    return { ...filters, fecha_desde: desde, fecha_hasta: hasta };
  }, [filters]);

  useEffect(() => {
    const fetchRelevamientos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          scope: "all", // 👈 ADMIN ve todos
          page: String(page),
          pageSize: String(pageSize),
          ...(effectiveFilters.cui ? { cui: effectiveFilters.cui } : {}),
          ...(effectiveFilters.created_by
            ? { created_by: effectiveFilters.created_by }
            : {}),
          ...(effectiveFilters.estado
            ? { estado: effectiveFilters.estado }
            : {}),
          ...(effectiveFilters.fecha_desde
            ? { fecha_desde: effectiveFilters.fecha_desde }
            : {}),
          ...(effectiveFilters.fecha_hasta
            ? { fecha_hasta: effectiveFilters.fecha_hasta }
            : {}),
        }).toString();

        const res = await fetch(`/api/relevamientos?${params}`, {
          credentials: "include",
        });
        const data = await res.json();

        // Estructura esperada: { items: Relevamiento[], total, page, pageSize }
        if (res.ok && data?.items && Array.isArray(data.items)) {
          setRelevamientos(data.items);
          setTotal(data.total ?? data.items.length);
        } else {
          console.error("Respuesta inesperada:", data);
          setRelevamientos([]);
          setTotal(0);
        }
      } catch (error) {
        console.error("Error al cargar relevamientos:", error);
        setRelevamientos([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRelevamientos();
  }, [page, pageSize, effectiveFilters]);

  const handleEditar = (id: number) => {
    dispatch(setRelevamientoId(id));
    sessionStorage.setItem("relevamientoId", String(id));
    router.push(`/home/relevamiento/detalle/${id}`);
  };

  const handleViewDetalle = (id: number) => {
    router.push(`/home/relevamiento/detalle/${id}`);
  };

  const handleView = (id: number) => {
    router.push(`/admin/dashboard/relevamiento/${id}`);
  };

  const handleViewPdf = (id: number) => {
    router.push(`/home/pdf/${id}`);
  };

  if (loading) return <Spinner />;

  return (
    <div className="mx-10 mt-6">
      <h2 className="text-xl font-semibold mb-4">Relevamientos</h2>

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
              {/* 👇 usa tu campo actual cui_id (ajusta si tu API devuelve 'cui') */}
              <td className="px-4 py-2 text-center text-sm">
                {(r as any).cui_id ?? (r as any).cui}
              </td>
              <td className="px-4 py-2 text-center text-sm">{r.created_by}</td>
              <td className="px-4 py-2 text-center text-sm">
                {r.created_at
                  ? format(new Date(r.created_at), "dd/MM/yyyy HH:mm", {
                      locale: es,
                    })
                  : "-"}
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
                  onClick={() => r.estado === "completo" && handleView(r.id)}
                  disabled={r.estado !== "completo"}
                  title={
                    r.estado !== "completo"
                      ? "Disponible cuando el relevamiento esté completo"
                      : "Ver dashboard"
                  }
                  className={`font-bold px-4 py-1 rounded
    ${
      r.estado === "completo"
        ? "bg-indigo-600 text-white hover:bg-indigo-600/50"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
                >
                  📊 Ver Dashboard
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

      {/* Paginación */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">Total: {total}</span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Anterior
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() =>
              setPage((p) => (page * pageSize < total ? p + 1 : p))
            }
            disabled={page * pageSize >= total}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
