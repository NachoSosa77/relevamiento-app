"use client";

import ConstruccionInstituciones from "@/components/ConstruccionInstituciones";
import CuiConstruccionComponent from "@/components/Forms/dinamicForm/CuiConstruccionComponent";
import Spinner from "@/components/ui/Spinner";
import { InstitucionesData } from "@/interfaces/Instituciones";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  estructuraResistente,
  estructuraTecho,
  paredesCerramientos,
} from "../config/relevamientoEstructura";
import CaracteristicasConservacion from "./CaracteristicasConservacion";

export default function RelevamientoConstruccionesId({
  relevamientoId,
}: {
  relevamientoId: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const construccionIdFromQuery = useMemo(() => {
    const raw = searchParams.get("construccionId");
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [searchParams]);

  const [cuiId, setCuiId] = useState<number | null>(null);
  const [loadingRel, setLoadingRel] = useState(true);

  const [selectedInstitutions, setSelectedInstitutions] = useState<
    InstitucionesData[] | null
  >(null);

  const [construcciones, setConstrucciones] = useState<
    { id: number; numero_construccion: number | null }[]
  >([]);
  const [loadingConstrucciones, setLoadingConstrucciones] = useState(true);

  const [construccionId, setConstruccionId] = useState<number | null>(null);

  // Para no re-inicializar construccionId una y otra vez
  const didInitConstruccionIdRef = useRef(false);

  // 1) Traer cui_id del relevamiento
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingRel(true);
        const res = await fetch(`/api/relevamientos/by-id/${relevamientoId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("No se pudo cargar relevamiento");
        const data = await res.json();
        if (!cancelled) setCuiId(Number(data?.cui_id) || null);
      } catch (e) {
        console.error(e);
        if (!cancelled) setCuiId(null);
      } finally {
        if (!cancelled) setLoadingRel(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [relevamientoId]);

  // 2) Traer instituciones por relevamiento
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/instituciones_por_relevamiento/${relevamientoId}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Error al obtener instituciones");
        const data = await res.json();
        if (!cancelled) setSelectedInstitutions(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setSelectedInstitutions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [relevamientoId]);

  // 3) Traer construcciones del relevamiento (SOLO carga lista)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingConstrucciones(true);
        const res = await fetch(
          `/api/relevamientos/by-id/${relevamientoId}/construcciones`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("No se pudo cargar construcciones");
        const data = await res.json();
        const items = (data?.items || []) as {
          id: number;
          numero_construccion: number | null;
        }[];
        if (cancelled) return;

        setConstrucciones(items);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setConstrucciones([]);
        }
      } finally {
        if (!cancelled) setLoadingConstrucciones(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [relevamientoId]);

  // 4) Inicializar construccionId 1 sola vez (o cuando cambia relevamientoId)
  useEffect(() => {
    // reset init cuando cambia relevamientoId
    didInitConstruccionIdRef.current = false;
    setConstruccionId(null);
  }, [relevamientoId]);

  useEffect(() => {
    if (didInitConstruccionIdRef.current) return;
    if (loadingConstrucciones) return;

    const items = construcciones;
    if (!items.length) {
      didInitConstruccionIdRef.current = true;
      setConstruccionId(null);
      return;
    }

    const exists =
      construccionIdFromQuery != null &&
      items.some((x) => x.id === construccionIdFromQuery);

    const nextId = exists ? construccionIdFromQuery : items[0].id;

    didInitConstruccionIdRef.current = true;
    setConstruccionId(nextId);
  }, [loadingConstrucciones, construcciones, construccionIdFromQuery]);

  // 5) Mantener la URL sincronizada con la construcción seleccionada (deep-link)
  useEffect(() => {
    if (!construccionId) return;

    const current = searchParams.get("construccionId");
    if (current === String(construccionId)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("construccionId", String(construccionId));
    router.replace(`?${params.toString()}`);
  }, [construccionId, router, searchParams]);

  if (loadingRel || loadingConstrucciones || selectedInstitutions === null) {
    return (
      <div className="flex justify-center items-center h-full mt-40">
        <Spinner />
      </div>
    );
  }

  if (!cuiId) {
    return (
      <div className="p-6 text-gray-700">
        No se pudo resolver el CUI del relevamiento.
      </div>
    );
  }

  return (
    <div className="h-full bg-white text-black text-sm mt-28">
      <div className="flex items-center gap-4 mt-20 mb-8 mx-8">
        <button
          onClick={() =>
            router.push(`/admin/dashboard`)
          }
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={16} />
          Volver al dashboard
        </button>

        <h1 className="font-bold">Relevamiento N° {relevamientoId}</h1>
      </div>

      {/* Selector SIEMPRE visible: mismo flujo que antes */}
      <CuiConstruccionComponent
        relevamientoId={relevamientoId}
        selectedInstitutions={selectedInstitutions}
        initialCui={cuiId}
        onCuiInputChange={() => {}}
        isReadOnly={false}
        label="COMPLETE UN FORMULARIO POR CADA CONSTRUCCIÓN DEL PREDIO"
        sublabel="..."
        setConstruccionId={setConstruccionId}
      />

      {!construccionId ? (
        <div className="mt-10 p-6 text-gray-600">
          Este relevamiento no tiene construcciones registradas.
        </div>
      ) : (
        // OJO: te recomiendo NO forzar remount con key. Si querés, lo vemos.
        <div>
          <ConstruccionInstituciones
            construccionId={construccionId}
            relevamientoId={relevamientoId}
          />

          <CaracteristicasConservacion
            id={10}
            relevamientoId={relevamientoId}
            label="ESTRUCTURA RESISTENTE"
            estructuras={estructuraResistente}
            construccionId={construccionId}
            tipo="estructura_resistente"
          />
          <CaracteristicasConservacion
            id={11}
            relevamientoId={relevamientoId}
            label="TECHO"
            estructuras={estructuraTecho}
            construccionId={construccionId}
            tipo="techo"
          />
          <CaracteristicasConservacion
            id={12}
            relevamientoId={relevamientoId}
            label="PAREDES Y CERRAMIENTOS EXTERIORES"
            estructuras={paredesCerramientos}
            construccionId={construccionId}
            tipo="paredes_cerramientos"
          />
        </div>
      )}
    </div>
  );
}
