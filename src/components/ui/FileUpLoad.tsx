import React, { useState } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {const file = event.target.files[0];
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
          setSelectedFile(file);
          onFileChange(file);
        } else {
          alert('Solo se permiten imágenes y PDFs');
        }
      }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileChange(null);
  };

  return (
    <div className="flex justify-center items-center gap-2">
        <label className='flex items-center text-sm font-bold px-4 py-2 bg-gray-100 border border-gray-200 rounded-md cursor-pointer'>
      <span className='mr-2'>Subir Plano</span>
      <input
        className='sr-only'
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <div className='flex items-center justify-center bg-gray-200  rounded-md p-2'>
          <p className='text-sm text-gray-400'>Archivo seleccionado: {selectedFile.name}</p>
          <button className='ml-4 text-sm border rounded p-2 bg-white' onClick={handleRemoveFile}>Eliminar</button>
        </div>
      )}
      </label>
    </div>
  );
};

export default FileUpload;
