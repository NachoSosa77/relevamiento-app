/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/redux/hooks"; // Asegúrate de que el hook esté configurado
import { setArchivosSubidos } from "@/redux/slices/archivoSlice"; // Importa la acción de Redux
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  relevamientoId?: number;
  onUploadSuccess?: (archivos: any[]) => void;
}

const FileUpload: React.FC<Props> = ({ relevamientoId, onUploadSuccess }) => {
  const dispatch = useAppDispatch();

  // Verifica si el estado está inicializado correctamente
  const archivosSubidosRedux = useAppSelector(
    (state) => state.archivos?.archivosSubidos || []
  );

  const [archivos, setArchivos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const closeModal = () => setModalIndex(null);
const nextImage = () =>
  setModalIndex((prev) => (prev !== null && prev < archivosSubidosRedux.length - 1 ? prev + 1 : prev));
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

    const formData = new FormData();
    archivos.forEach((file) => formData.append("files", file));
    formData.append("relevamientoId", relevamientoId.toString());

    try {
      setIsUploading(true);

      const res = await fetch("/api/archivos", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al subir archivos");

      toast.success("Archivos subidos con éxito");
      setArchivos([]); // Limpiar los archivos en el estado local
      setPreviews([]); // Limpiar las vistas previas
      dispatch(setArchivosSubidos(data.archivos)); // Actualiza el estado global de Redux
      onUploadSuccess?.(data.archivos);
    } catch (err: any) {
      console.error(err);
      toast.error("Error al subir archivos");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    // Revoke object URLs para liberar memoria
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (modalIndex === null) return;

    if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    } else if (e.key === "Escape") {
      closeModal();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
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
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-custom
          hover:file:bg-custom/50"
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
          e.stopPropagation(); // evita que se dispare el modal
          handleEliminarArchivoSubido(index);
        }}
        className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
        title="Eliminar archivo"
        type="button"
      >
        ×
      </button>

      {archivo.tipo_archivo === "pdf" ? (
        <iframe src={archivo.archivo_url} className="w-full h-full" />
      ) : (
        <Image
          src={archivo.archivo_url}
          alt={`archivo-${index}`}
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

      {/* Botones para navegar */}
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
