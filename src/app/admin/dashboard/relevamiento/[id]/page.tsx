// src/app/admin/dashboard/relevamiento/[id]/page.tsx
// (o panel, según tu carpeta real)

import RelevamientoDashboardClient from "@/app/admin/components/RelevamientoDashboardClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;        // 👈 acá lo esperás
  const relevamientoId = Number(id);

  return <RelevamientoDashboardClient relevamientoId={relevamientoId} />;
}
