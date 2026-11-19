import { NextResponse, type NextRequest } from "next/server";

import { TOKEN_COOKIE } from "@/features/auth/constants";
import { parseToken } from "@/features/auth/token";

// Public pages: reachable without a session (and skipped when already signed in).
const AUTH_PAGES = ["/login", "/register", "/activate"];
const OWNER_AREA = "/owner";

const isUnder = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

// Next.js 16: `middleware.ts` was renamed `proxy.ts`.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = parseToken(request.cookies.get(TOKEN_COOKIE)?.value);
  const isAuthPage = AUTH_PAGES.some((p) => isUnder(pathname, p));

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // Clinic-owner area: any other role is bounced out before anything renders.
  if (
    session &&
    isUnder(pathname, OWNER_AREA) &&
    session.role !== "CLINIC_OWNER"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next internals and any file with an extension (public assets).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
