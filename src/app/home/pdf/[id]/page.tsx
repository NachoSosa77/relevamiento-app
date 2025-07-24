"use client";

import VerPdfPage from "@/components/Pdf/VerPdfPage";
import { useParams, useRouter } from "next/navigation";


export default function PdfPage() {
    const router = useRouter();
    const { id } = useParams();
    const relevamientoId = Number(id);
  
  return (
    <div className="mt-32 p-6 max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.push('/home')}
        className="bg-custom hover:bg-custom/50 text-white rounded-md px-4 py-1 mr-2"
      >
        Volver
      </button>
        <VerPdfPage relevamientoId={relevamientoId
        }/>
    </div>
  );
}
