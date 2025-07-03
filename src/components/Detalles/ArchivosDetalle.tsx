/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";

interface Archivo {
  archivo_url: string;
  tipo_archivo: "imagen" | "pdf";
}

export const ArchivosDetalle = ({ relevamientoId }: { relevamientoId: number }) => {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoadingLightbox, setIsLoadingLightbox] = useState(true);

  useEffect(() => {
    const fetchArchivos = async () => {
      try {
        const res = await fetch(`/api/archivos?relevamientoId=${relevamientoId}`);
        if (!res.ok) throw new Error("Error al obtener archivos");
        const data = await res.json();
        setArchivos(data.archivos || []);
      } catch (err) {
        toast.error("Error al cargar archivos");
      } finally {
        setLoading(false);
      }
    };

    fetchArchivos();
  }, [relevamientoId]);

  const imagenes = archivos.filter((a) => a.tipo_archivo === "imagen");

  const handleImageClick = (url: string) => {
    const index = imagenes.findIndex((i) => i.archivo_url === url);
    setIsLoadingLightbox(true);
    setLightboxIndex(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  if (!archivos.length) {
    return (
      <p className="text-center text-gray-500">
        No se encontraron archivos para este relevamiento.
      </p>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {archivos.map((archivo, idx) => (
          <div
            key={idx}
            className="break-inside-avoid rounded-xl overflow-hidden bg-white shadow hover:shadow-md transition border cursor-pointer"
            onClick={() => {
              if (archivo.tipo_archivo === "imagen") {
                handleImageClick(archivo.archivo_url);
              }
            }}
          >
            <div className="bg-gray-100 text-xs text-gray-600 px-4 py-2 font-medium">
              {archivo.tipo_archivo.toUpperCase()}
            </div>

            {archivo.tipo_archivo === "imagen" ? (
              <Image
                src={archivo.archivo_url}
                alt="Vista previa"
                className="w-full h-auto object-cover"
                width={500}
                height={300}
              />
            ) : (
              <iframe
                src={archivo.archivo_url}
                className="w-full h-64"
                title="Vista previa PDF"
              />
            )}

            <div className="px-4 py-2 border-t text-right">
              <a
                href={archivo.archivo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Ver / Descargar
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Spinner de carga superpuesto */}
      {lightboxIndex !== null && isLoadingLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <Spinner />
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          mainSrc={imagenes[lightboxIndex].archivo_url}
          nextSrc={imagenes[(lightboxIndex + 1) % imagenes.length]?.archivo_url}
          prevSrc={imagenes[(lightboxIndex + imagenes.length - 1) % imagenes.length]?.archivo_url}
          onCloseRequest={() => setLightboxIndex(null)}
          onImageLoad={() => setIsLoadingLightbox(false)}
          onMovePrevRequest={() => {
            setIsLoadingLightbox(true);
            setLightboxIndex((lightboxIndex + imagenes.length - 1) % imagenes.length);
          }}
          onMoveNextRequest={() => {
            setIsLoadingLightbox(true);
            setLightboxIndex((lightboxIndex + 1) % imagenes.length);
          }}
        />
      )}
    </>
  );
};
