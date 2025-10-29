"use client";

import TablaRelevamientosAdmin from "@/components/Table/TablaRelevamientosAdmin";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AdminRelevamientosPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.roles?.includes("ADMIN"))) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // filtros por defecto: últimos 30 días
  const defaultFilters = useMemo(() => {
    const d = new Date();
    const fecha_hasta = d.toISOString().slice(0, 10);
    d.setDate(d.getDate() - 30);
    const fecha_desde = d.toISOString().slice(0, 10);
    return { fecha_desde, fecha_hasta, created_by: "", estado: "" };
  }, []);

  const [filters, setFilters] = useState(defaultFilters);

  if (loading || !user?.roles?.includes("ADMIN")) return null;

  return (
    <div className="mt-24 p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">
          Usuario: <span className="font-medium">{user.email}</span>
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-gray-700">
            Filtros de búsqueda
          </h2>
          <button
            onClick={() =>
              setFilters({
                fecha_desde: defaultFilters.fecha_desde,
                fecha_hasta: defaultFilters.fecha_hasta,
                created_by: "",
                estado: "",
              })
            }
            className="text-white bg-custom hover:bg-custom/90 text-sm px-3 py-1.5 rounded-md shadow-sm transition"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Desde */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Desde
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-custom focus:outline-none transition"
              value={filters.fecha_desde ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, fecha_desde: e.target.value }))
              }
            />
          </div>

          {/* Hasta */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Hasta
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-custom focus:outline-none transition"
              value={filters.fecha_hasta ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, fecha_hasta: e.target.value }))
              }
            />
          </div>

          {/* Usuario */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Usuario (email)
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-custom focus:outline-none transition"
              placeholder="ej: usuario@correo.com"
              value={filters.created_by ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, created_by: e.target.value }))
              }
            />
          </div>

          {/* Estado */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Estado
            </label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-custom focus:outline-none transition"
              value={filters.estado ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, estado: e.target.value }))
              }
            >
              <option value="">Todos</option>
              <option value="incompleto">Incompleto</option>
              <option value="completo">Completo</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modo admin: trae todos (scope=all) con paginación */}
      <TablaRelevamientosAdmin filters={filters} pageSize={25} />
    </div>
  );
}
