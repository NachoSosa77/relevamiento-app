import RelevamientoConstruccionesId from "../components/RelevamientoConstruccionesId";

export default async function Page({
  params,
}: {
  params: Promise<{ relevamientoId: string }>;
}) {
  // ⬇️ IMPORTANTE: await params
  const { relevamientoId } = await params;

  const id = Number(relevamientoId);

  // Validación defensiva
  if (!Number.isFinite(id) || id <= 0) {
    return (
      <div className="p-6 text-gray-700">
        Relevamiento inválido
      </div>
    );
  }

  return <RelevamientoConstruccionesId relevamientoId={id} />;
}
