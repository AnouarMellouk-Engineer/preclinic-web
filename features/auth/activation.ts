import { decodeJwt } from "jose";

export type ActivationLinkState = "ok" | "missing" | "invalid" | "expired";

/**
 * Light client-side sanity check so the user sees a clear message instead of a
 * failed request. The backend remains the only real validator (signature, single use).
 */
export function inspectActivationToken(token?: string): ActivationLinkState {
  if (!token) return "missing";
  try {
    const claims = decodeJwt(token);
    if (claims.purpose !== "activation") return "invalid";
    if (claims.exp && claims.exp * 1000 <= Date.now()) return "expired";
    return "ok";
  } catch {
    return "invalid";
  }
}
