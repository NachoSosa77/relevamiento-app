import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|login|signin|forgot-password|_next/static|_next/image|favicon.ico|img).*)",
  ], // Protege todas las rutas excepto /login y las rutas de API y archivos estáticos
};
