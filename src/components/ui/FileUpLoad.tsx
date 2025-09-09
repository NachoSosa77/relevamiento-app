/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setArchivosSubidos } from "@/redux/slices/archivoSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  relevamientoId?: number;
  onUploadSuccess?: (archivos: any[]) => void;
}

const FileUpload: React.FC<Props> = ({ relevamientoId, onUploadSuccess }) => {
  const dispatch = useAppDispatch();
  const archivosSubidosRedux = useAppSelector(
    (state) => state.archivos?.archivosSubidos || []
  );

  const [archivos, setArchivos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const closeModal = () => setModalIndex(null);
  const nextImage = () =>
    setModalIndex((prev) =>
      prev !== null && prev < archivosSubidosRedux.length - 1 ? prev + 1 : prev
    );
  const prevImage = () =>
    setModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const nuevosArchivos = Array.from(files);
    setArchivos((prev) => [...prev, ...nuevosArchivos]);

    const nuevasPreviews = nuevosArchivos.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews((prev) => [...prev, ...nuevasPreviews]);
  };

  const handleUpload = async () => {
    if (!relevamientoId || relevamientoId <= 0) {
      toast.error("ID de relevamiento inválido o no proporcionado");
      return;
    }

    if (!archivos.length) {
      toast.warning("No hay archivos para subir");
      return;
    }

    const loteSize = 20; // cantidad de archivos por lote
    const totalLotes = Math.ceil(archivos.length / loteSize); // total de lotes a subir
    let subidosTotal: any[] = [];

    setIsUploading(true);
    setUploadProgress(0); // resetear barra

    for (let i = 0; i < archivos.length; i += loteSize) {
      const lote = archivos.slice(i, i + loteSize);
      const currentLote = Math.floor(i / loteSize) + 1;

      const formData = new FormData();
      lote.forEach((file) => formData.append("files", file));
      formData.append("relevamientoId", relevamientoId.toString()); // 🔹 enviamos el ID al backend

      try {
        toast.info(`Subiendo lote ${currentLote} de ${totalLotes}...`);

        const res = await fetch("/api/archivos", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error al subir archivos");

        subidosTotal = [...subidosTotal, ...data.archivos];
        dispatch(
          setArchivosSubidos([...archivosSubidosRedux, ...data.archivos])
        );

        // Calcular progreso porcentual
        const progress = Math.min((currentLote / totalLotes) * 100, 100);
        setUploadProgress(progress);
      } catch (err) {
        console.error("Error en lote:", err);
        toast.error(
          `Error en la subida de archivos del grupo ${i + 1} al ${
            i + lote.length
          }`
        );
      }
    }

    setArchivos([]); // limpiar después de todo
    setPreviews([]);
    onUploadSuccess?.(subidosTotal);
    toast.success("Todos los archivos fueron subidos");

    setIsUploading(false);
    setUploadProgress(100); // finalizar barra al 100%
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalIndex === null) return;

      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalIndex, archivosSubidosRedux.length]);

  const handleEliminarArchivoSubido = (index: number) => {
    const nuevosArchivos = archivosSubidosRedux.filter((_, i) => i !== index);
    dispatch(setArchivosSubidos(nuevosArchivos));
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-custom hover:file:bg-custom/50"
      />

      <div className="flex flex-wrap gap-4 max-h-[300px] overflow-y-auto">
        {archivosSubidosRedux.map((archivo, index) => (
          <div
            key={index}
            className="relative w-48 h-48 rounded overflow-hidden shadow-sm border flex-shrink-0 cursor-pointer"
            onClick={() => setModalIndex(index)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEliminarArchivoSubido(index);
              }}
              className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              title="Eliminar archivo"
              type="button"
            >
              ×
            </button>
            <div className="w-full h-40 relative">
              {archivo.tipo_archivo === "pdf" ? (
                <iframe src={archivo.archivo_url} className="w-full h-full" />
              ) : (
                <Image
                  src={archivo.archivo_url}
                  alt={archivo.nombre_archivo ?? "Archivo subido"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            {/* 👇 Mostrar nombre del archivo */}
            <div className="p-1 text-xs text-center truncate">
              {archivo.nombre_archivo}
            </div>
          </div>
        ))}

        {previews.map((preview, index) => (
          <div
            key={"nuevo-" + index}
            className="relative w-48 h-48 rounded overflow-hidden shadow-sm border flex-shrink-0 cursor-pointer"
          >
            <button
              onClick={() => {
                setArchivos((prev) => prev.filter((_, i) => i !== index));
                setPreviews((prev) => prev.filter((_, i) => i !== index));
              }}
              className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              title="Eliminar archivo seleccionado"
              type="button"
            >
              ×
            </button>
            {archivos[index]?.type === "application/pdf" ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-semibold text-center">
                PDF
              </div>
            ) : (
              <Image
                src={preview}
                alt={`archivo-nuevo-${index}`}
                fill
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="px-4 py-2 bg-custom text-white rounded-lg hover:bg-custom/50 disabled:bg-blue-300"
      >
        {isUploading ? "Subiendo..." : "Confirmar subida"}
      </button>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded h-4 overflow-hidden mt-2">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {modalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-400"
          >
            ×
          </button>
          <div className="relative w-[90%] max-w-4xl h-[80%]">
            {archivosSubidosRedux[modalIndex].tipo_archivo === "pdf" ? (
              <iframe
                src={archivosSubidosRedux[modalIndex].archivo_url}
                className="w-full h-full rounded"
              />
            ) : (
              <Image
                src={archivosSubidosRedux[modalIndex].archivo_url}
                alt={`modal-${modalIndex}`}
                fill
                style={{ objectFit: "contain" }}
              />
            )}
            <button
              onClick={prevImage}
              disabled={modalIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              disabled={modalIndex === archivosSubidosRedux.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
