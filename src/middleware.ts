import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Middleware executed for route:", req.url);
  const token = req.cookies.get("token");
  if (!token) {
    console.log("Token not found. Redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|login|singin|_next/static|_next/image|favicon.ico|img).*)",
  ], // Protege todas las rutas excepto /login y las rutas de API y archivos estáticos
};
