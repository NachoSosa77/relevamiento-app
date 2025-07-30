"use client";

import VerPdfPage from "@/components/Pdf/VerPdfPage";
import { useParams, useRouter } from "next/navigation";


export default function PdfPage() {
    const router = useRouter();
    const { id } = useParams();
    const relevamientoId = Number(id);
  
  return (
    <div className="h-full mt-32 mx-auto p-6 space-y-6">
      <button
        onClick={() => router.push('/home')}
        className="bg-custom hover:bg-custom/50 text-white rounded-md px-4 py-1 mr-2"
      >
        Volver
      </button>
        <VerPdfPage relevamientoId={relevamientoId}/>
    </div>
  );
}
