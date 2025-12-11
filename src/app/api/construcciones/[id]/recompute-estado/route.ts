// src/app/api/construcciones/[id]/recompute-estado/route.ts
import { recomputeEstadoConstruccion } from "@/app/lib/recompute-estado";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const construccionId = Number((await params).id);
    const { relevamientoId } = await req.json();

    const res = await recomputeEstadoConstruccion(
      relevamientoId,
      construccionId
    );

    return NextResponse.json({ ok: true, ...res }, { status: 200 });
  } catch (err: any) {
    console.error("POST /api/construcciones/[id]/recompute-estado:", err);
    return NextResponse.json(
      { ok: false, error: err?.message },
      { status: 500 }
    );
  }
}
