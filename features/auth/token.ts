import { decodeJwt } from "jose";
import { z } from "zod";

export const ROLES = [
  "CLINIC_OWNER",
  "DOCTOR",
  "RECEPTIONIST",
  "PATIENT",
] as const;
export type Role = (typeof ROLES)[number];

// The backend signs the token; here we only read its claims (no secret on the front).
const claimsSchema = z.object({
  sub: z.string().optional(),
  role: z.enum(ROLES),
  clinicId: z.string().nullish(),
  membershipId: z.string().nullish(),
  exp: z.number().optional(),
});

export type SessionUser = {
  userId?: string;
  role: Role;
  clinicId?: string;
  membershipId?: string;
  expiresAt?: Date;
};

/** Pure helper (safe in proxy.ts, server actions and server components). Returns null if invalid/expired. */
export function parseToken(token?: string | null): SessionUser | null {
  if (!token) return null;
  try {
    const claims = claimsSchema.parse(decodeJwt(token));
    if (claims.exp && claims.exp * 1000 <= Date.now()) return null;
    return {
      userId: claims.sub,
      role: claims.role,
      clinicId: claims.clinicId ?? undefined,
      membershipId: claims.membershipId ?? undefined,
      expiresAt: claims.exp ? new Date(claims.exp * 1000) : undefined,
    };
  } catch {
    return null;
  }
}
