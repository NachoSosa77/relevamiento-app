/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";

interface Institucion {
    institucion: string;
    cue: number;
    cui: number;
  }
  
  interface InstitucionesTableProps {
    cui: number | null;
  }

export default function InstitucionesTable({ cui }: InstitucionesTableProps) {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cui) return;
    const fetchInstituciones = async () => {
      try {
        const res = await fetch(`/api/instituciones?cui=${cui}`);
        if (!res.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await res.json();
        setInstituciones(data.instituciones);
      } catch (error) {
        setError("No se pudieron cargar las instituciones.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstituciones();
  }, [cui]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (instituciones.length === 0) return <p>No hay instituciones para el CUI seleccionado.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-slate-200 text-sm">
            <th className="border border-gray-300 px-4 py-2">Denominación del establecimiento</th>
            <th className="border border-gray-300 px-4 py-2">CUE-Anexo</th>
          </tr>
        </thead>
        <tbody>
          {instituciones.map((inst, index) => (
            <tr key={index} className="border border-gray-300 text-sm">
              <td className="border border-gray-300 px-4 py-2">{inst.institucion}</td>
              <td className="border border-gray-300 px-4 py-2">{inst.cue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
