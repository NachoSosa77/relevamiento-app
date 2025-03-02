import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("token"); // ⬅️ Elimina la cookie

  return NextResponse.json({ message: "Sesión cerrada" }, { status: 200 });
}
