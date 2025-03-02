import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies(); // ⬅️ Usa await aquí
  const token = cookieStore.get("token")?.value; // ⬅️ Ahora sí puedes usar .get()

  return NextResponse.json({ token });
}
