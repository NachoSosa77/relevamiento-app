/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import Spinner from "../ui/Spinner";

interface Archivo {
  id: number;
  archivo_url: string;
  tipo_archivo: "imagen" | "pdf";
  nombre_archivo: string;
  selected?: boolean;
}

export const ArchivosDetalle = ({
  relevamientoId,
}: {
  relevamientoId: number;
}) => {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchArchivos = async () => {
      try {
        const res = await fetch(
          `/api/archivos?relevamientoId=${relevamientoId}`
        );
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

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/archivos?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar archivo");
      setArchivos((prev) => prev.filter((a) => a.id !== id));
      toast.success("Archivo eliminado");
    } catch (err) {
      toast.error("No se pudo eliminar el archivo");
    }
  };

  const handleDeleteSelected = async () => {
    const seleccionados = archivos.filter((a) => a.selected);
    if (!seleccionados.length) {
      toast.warning("No hay archivos seleccionados");
      return;
    }

    setLoadingDelete(true);
    const toastId = toast.info(
      `Eliminando archivos: 0 de ${seleccionados.length}...`,
      { autoClose: false }
    );

    let successCount = 0;

    for (const archivo of seleccionados) {
      try {
        const res = await fetch(`/api/archivos?id=${archivo.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar archivo");
        setArchivos((prev) => prev.filter((a) => a.id !== archivo.id));
        successCount++;
        toast.update(toastId, {
          render: `Eliminando archivos: ${successCount} de ${seleccionados.length}...`,
        });
      } catch (err) {
        console.error(`Error eliminando archivo ${archivo.nombre_archivo}`, err);
      }
    }

    if (successCount === seleccionados.length) {
      toast.update(toastId, {
        render: "Todos los archivos seleccionados eliminados",
        type: "success",
        autoClose: 3000,
      });
    } else if (successCount > 0) {
      toast.update(toastId, {
        render: `Se eliminaron ${successCount} de ${seleccionados.length} archivos`,
        type: "warning",
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render: "No se pudo eliminar ningún archivo",
        type: "error",
        autoClose: 3000,
      });
    }

    setLoadingDelete(false);
  };

  const toggleSelect = (id: number) => {
    setArchivos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
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
      {/* Grid de archivos */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {archivos.map((archivo) => (
          <div
            key={archivo.id}
            className={`relative break-inside-avoid rounded-xl overflow-hidden bg-white shadow hover:shadow-md transition border ${
              archivo.selected ? "ring-2 ring-blue-500" : ""
            }`}
          >
            {/* Imagen o PDF */}
            {archivo.tipo_archivo === "imagen" ? (
              <Image
                src={archivo.archivo_url}
                alt={archivo.nombre_archivo || "Archivo subido"}
                className="w-full h-40 object-cover"
                width={500}
                height={300}
                onClick={() => {
                  const index = imagenes.findIndex(
                    (i) => i.archivo_url === archivo.archivo_url
                  );
                  handleImageClick(index);
                }}
              />
            ) : (
              <iframe
                src={archivo.archivo_url}
                className="w-full h-40"
                title={archivo.nombre_archivo}
              />
            )}

            {/* Info + checkbox */}
            <div className="flex items-center justify-between bg-gray-100 px-3 py-1 shadow-inner">
              <div className="text-xs text-gray-700 truncate">
                <span className="font-semibold">
                  {archivo.tipo_archivo.toUpperCase()}
                </span>{" "}
                - {archivo.nombre_archivo}
              </div>
              <input
                type="checkbox"
                checked={archivo.selected || false}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleSelect(archivo.id);
                }}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Footer con botones */}
            <div className="px-4 py-2 border-t flex justify-between items-center">
              <a
                href={archivo.archivo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Ver / Descargar
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(archivo.id);
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón eliminar seleccionados */}
      {archivos.some((a) => a.selected) && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
            disabled={loadingDelete}
          >
            Eliminar seleccionados ({archivos.filter(a => a.selected).length})
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={imagenes.map((img) => ({ src: img.archivo_url }))}
          plugins={[Thumbnails]}
        />
      )}
    </>
  );
};
