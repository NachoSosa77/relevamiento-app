/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Navbar from "@/components/NavBar/NavBar";
import { relevamientoService } from "@/services/relevamientoService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Relevamiento {
  id: number;
  cui_id: number;
  created_at: string;
}

const DetallePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const relevamientoId = searchParams.get("id");

  const [relevamiento, setRelevamiento] = useState<Relevamiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Relevamiento ID:", relevamientoId);
  console.log("Relevamiento:", relevamiento);

  useEffect(() => {
    const fetchRelevamiento = async () => {
      if (!relevamientoId) return;

      try {
        const data = await relevamientoService.getRelevamientoById(Number(relevamientoId));
        setRelevamiento(data);
      } catch (err: any) {
        setError(err.message);
        toast.error("Error al cargar el relevamiento");
      } finally {
        setLoading(false);
      }
    };

    fetchRelevamiento();
  }, [relevamientoId]);

  if (loading) return <div>Cargando relevamiento...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full overflow-hidden bg-white text-black text-sm">
      <Navbar />

      <div className="flex justify-start mt-20 mx-10">
        <button
          onClick={() => router.push("/home")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Volver
        </button>
      </div>

      <div className="flex flex-col items-center mt-10">
        <h1 className="font-bold text-xl mb-2">Detalle del Relevamiento</h1>
        <div className="bg-gray-100 p-4 rounded shadow w-full max-w-xl">
          <p><strong>ID:</strong> {relevamiento?.id}</p>
          <p><strong>CUI:</strong> {relevamiento?.cui_id}</p>
          <p><strong>Creado el:</strong> {new Date(relevamiento!.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default DetallePage;
