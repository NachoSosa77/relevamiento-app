import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileChange: (files: File[] | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileURLs, setFileURLs] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uniqueFiles = acceptedFiles.filter(
      (file) => !selectedFiles.some(f => f.name === file.name && f.size === file.size)
    );
    setSelectedFiles(prev => [...prev, ...uniqueFiles]);
    setFileURLs(prev => [...prev, ...uniqueFiles.map(file => URL.createObjectURL(file))]);
    onFileChange([...selectedFiles, ...uniqueFiles]);
  }, [selectedFiles, onFileChange]);
  

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "image/*": [],
    },
    maxFiles: 5,
    noKeyboard: true,
    noClick: true, // Desactivamos el clic en el área de dropzone
  });

  const handleRemove = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedURLs = fileURLs.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFileURLs(updatedURLs);
    onFileChange(updatedFiles); // Pasamos el nuevo arreglo de archivos al padre
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <div
        {...getRootProps()}
        className="w-full border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all border-gray-300 bg-white"
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          Arrastrá archivos PDF o imágenes aquí, o hacé clic en
          &quot;Seleccionar archivos&quot;
        </p>
        <button
          onClick={open} // Al hacer clic, abrimos el selector de archivos
          type="button"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Seleccionar archivos
        </button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="w-full mt-4">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-4 rounded mt-2"
            >
              <span className="text-sm text-gray-700 truncate max-w-[70%]">
                {file.name}
              </span>
              <button
                onClick={() => handleRemove(index)}
                className="ml-4 text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 max-w-full">
        {fileURLs.map((fileURL, index) => (
          <div key={index} className="mt-4">
            {fileURL && selectedFiles[index].type === "application/pdf" ? (
              <Worker
                workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}
              >
                <Viewer fileUrl={fileURL} />
              </Worker>
            ) : fileURL && selectedFiles[index].type.startsWith("image/") ? (
              <Image
                src={fileURL}
                alt="Preview"
                className="max-w-full max-h-[500px] rounded shadow-md"
                width={100}
                height={100}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
