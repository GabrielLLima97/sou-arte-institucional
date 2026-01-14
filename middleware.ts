import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const hostRoutes: Record<string, string> = {
  "clinicasouluz.com.br": "/clinica-sou-luz",
  "www.clinicasouluz.com.br": "/clinica-sou-luz",
  "souluzassessoria.com.br": "/sou-luz-assessoria",
  "www.souluzassessoria.com.br": "/sou-luz-assessoria",
};

const portalPaths = ["/portal-admin", "/portal-socio"];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  const hostname = host.split(":")[0];
  const pathname = request.nextUrl.pathname;

  if (portalPaths.some((path) => pathname.startsWith(path))) {
    if (!hostname.endsWith("souarteemcuidados.com.br") && hostname !== "localhost") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname === "/") {
    const target = hostRoutes[hostname];
    if (target) {
      return NextResponse.rewrite(new URL(target, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/portal-admin/:path*", "/portal-socio/:path*"],
};
