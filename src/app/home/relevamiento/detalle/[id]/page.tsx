/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import InstitucionesDetalle from "@/components/Detalles/InstitucionesDetalles";
import { PredioDetalle } from "@/components/Detalles/PredioDetalle";
import RespondientesDetalle from "@/components/Detalles/RespondientesDetalles";
import { Accordion } from "@/components/ui/Acordion";
import { AccordionItem } from "@/components/ui/AcordionItem";
import { relevamientoService } from "@/services/relevamientoService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


interface Relevamiento {
  id: number;
  cui_id: number;
  created_at: string;
}

const DetallePage = () => {
  const router = useRouter();
  const {id} = useParams();
  const relevamientoId = Number(id);


  const [relevamiento, setRelevamiento] = useState<Relevamiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchRelevamiento = async () => {
      if (!relevamientoId) return;

      try {
        const data = await relevamientoService.getRelevamientoById(relevamientoId);
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
  <div className="p-6 max-w-4xl mx-auto space-y-6">
    <button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-1 mr-2">Volver</button>

    <div className="space-y-1">
      <h1 className="text-2xl font-bold text-gray-800">Relevamiento #{relevamiento?.id}</h1>
      <p className="text-sm text-gray-500">Creado el: {relevamiento?.created_at}</p>
      <p className="text-sm text-gray-500">N° Cui: {relevamiento?.cui_id}</p>
    </div>

    <Accordion type="multiple" className="space-y-4">
      <AccordionItem value="instituciones" title="Instituciones involucradas">
        <InstitucionesDetalle relevamientoId={relevamientoId}/>
      </AccordionItem>

      <AccordionItem value="respondientes" title="Respondientes">
         <RespondientesDetalle relevamientoId={relevamientoId}/>
      </AccordionItem>

      <AccordionItem value="predio" title="Predio">
         <PredioDetalle relevamientoId={relevamientoId}/>
      </AccordionItem>
    </Accordion>
  </div>
);
};

export default DetallePage;
