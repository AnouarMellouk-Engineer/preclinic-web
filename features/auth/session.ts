import "server-only";

import { cookies } from "next/headers";

import { TOKEN_COOKIE } from "./constants";
import { parseToken, type SessionUser } from "./token";

/** The JWT lives in an httpOnly cookie: the browser JS never sees it. */
export async function getSession(): Promise<{
  token: string;
  user: SessionUser;
} | null> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  const user = parseToken(token);
  return token && user ? { token, user } : null;
}

export async function createSession(
  token: string,
  user: SessionUser,
  remember: boolean,
) {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // "Remember me" => persistent cookie until the token expires; otherwise a session cookie.
    expires: remember ? user.expiresAt : undefined,
  });
}

export async function destroySession() {
  (await cookies()).delete(TOKEN_COOKIE);
}
