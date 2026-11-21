import "server-only";

import { ApiError } from "@/lib/api/client";
import { requireOwner } from "@/features/auth/guards";

import { staffApi } from "./api";
import { SPECIALISTS, type Specialist } from "./constants";
import type { Doctor, Receptionist } from "./types";

export type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

/* ---------- tolerant normalisation ----------
 * GET /doctors has no documented response schema. We accept a bare array or
 * { data | items | results: [...] }, and either a nested `user` object
 * (TenantMembership) or flat fields. Adjust `toDoctor` once the real shape is known.
 */
type Raw = Record<string, unknown>;
const isObj = (v: unknown): v is Raw => typeof v === "object" && v !== null;
const str = (v: unknown) => (typeof v === "string" ? v : undefined);

function extractList(raw: unknown): Raw[] {
  if (Array.isArray(raw)) return raw.filter(isObj);
  if (isObj(raw)) {
    for (const key of ["data", "items", "results"]) {
      const value = raw[key];
      if (Array.isArray(value)) return value.filter(isObj);
    }
  }
  return [];
}

function toDoctor(raw: Raw): Doctor {
  const user = isObj(raw.user) ? raw.user : raw;
  const specialist = str(raw.specialist);
  return {
    id: str(raw.id) ?? str(user.id) ?? "",
    firstName: str(user.firstName) ?? "",
    lastName: str(user.lastName) ?? "",
    email: str(user.email) ?? "",
    phone: str(user.phone) ?? "",
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : true,
    specialist: SPECIALISTS.includes(specialist as Specialist)
      ? (specialist as Specialist)
      : null,
    pricingPerConsultation:
      str(raw.pricingPerConsultation) ??
      (typeof raw.pricingPerConsultation === "number"
        ? String(raw.pricingPerConsultation)
        : null),
  };
}

function toReceptionist(raw: Raw): Receptionist {
  const user = isObj(raw.user) ? raw.user : raw;

  return {
    id: str(raw.id) ?? str(user.id) ?? "",
    firstName: str(user.firstName) ?? "",
    lastName: str(user.lastName) ?? "",
    email: str(user.email) ?? "",
    phone: str(user.phone) ?? "",
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : true,
  };
}

/** Always re-checks the role: pages/layouts alone are not a security boundary. */
export async function getDoctors(): Promise<QueryResult<Doctor[]>> {
  const { token, user } = await requireOwner();
  try {
    const raw = await staffApi.listDoctors(token, user.clinicId);
    return { ok: true, data: extractList(raw).map(toDoctor) };
  } catch (error) {
    if (error instanceof ApiError && error.status < 500) {
      return { ok: false, message: error.messages[0] ?? error.message };
    }
    return { ok: false, message: "Couldn't load doctors. Please try again." };
  }
}

/**
 * BACKEND GAP: the API docs have no endpoint to list receptionists
 * (only POST /register/staff). Until one exists (e.g. GET /staff?role=RECEPTIONIST)
 * this returns an empty list and the page shows an explanatory notice.
 */
export const RECEPTIONISTS_LIST_SUPPORTED = true;

export async function getReceptionists(): Promise<QueryResult<Receptionist[]>> {
  const { token, user } = await requireOwner();

  try {
    const raw = await staffApi.listReceptionists(token, user.clinicId);

    return {
      ok: true,
      data: extractList(raw).map(toReceptionist),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status < 500) {
      return {
        ok: false,
        message: error.messages[0] ?? error.message,
      };
    }

    return {
      ok: false,
      message: "Couldn't load receptionists. Please try again.",
    };
  }
}
