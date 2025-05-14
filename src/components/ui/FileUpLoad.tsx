/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/redux/hooks"; // Asegúrate de que el hook esté configurado
import { setArchivosSubidos } from "@/redux/slices/archivoSlice"; // Importa la acción de Redux
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  relevamientoId: number;
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
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Muestra los archivos previos que se han guardado en Redux */}
        {archivosSubidosRedux.map((archivo, index) =>
          archivo.tipo_archivo === "pdf" ? (
            <iframe
              key={index}
              src={archivo.archivo_url}
              className="w-full h-64 border rounded shadow-sm"
            />
          ) : (
            <div
              key={index}
              className="relative w-full h-64 rounded overflow-hidden shadow-sm"
            >
              <Image
                src={archivo.archivo_url}
                alt={`archivo-${index}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )
        )}

        {/* Muestra las vistas previas de los archivos seleccionados en el estado local */}
        {previews.map((src, index) =>
          archivos[index]?.type.includes("pdf") ? (
            <iframe
              key={index}
              src={src}
              className="w-full h-64 border rounded shadow-sm"
            />
          ) : (
            <div
              key={index}
              className="relative w-full h-64 rounded overflow-hidden shadow-sm"
            >
              <Image
                src={src}
                alt={`preview-${index}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isUploading ? "Subiendo..." : "Confirmar subida"}
      </button>
    </div>
  );
};

export default FileUpload;
