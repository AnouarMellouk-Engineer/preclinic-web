import { NextResponse, type NextRequest } from "next/server";

import { TOKEN_COOKIE } from "@/features/auth/constants";
import { parseToken } from "@/features/auth/token";

const AUTH_PAGES = ["/login", "/register"];

// Next.js 16: `middleware.ts` was renamed `proxy.ts`.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = parseToken(request.cookies.get(TOKEN_COOKIE)?.value);
  const isAuthPage = AUTH_PAGES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next internals and any file with an extension (public assets).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
