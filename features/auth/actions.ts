"use server";

import { redirect } from "next/navigation";

import { ApiError } from "@/lib/api/client";

import { authApi } from "./api";
import { DEFAULT_TIMEZONE, HOME_BY_ROLE, WEB_ROLES } from "./constants";
import {
  loginSchema,
  registerClinicSchema,
  type LoginValues,
  type RegisterClinicValues,
} from "./schemas";
import { createSession, destroySession } from "./session";
import { parseToken } from "./token";

export type ActionResult =
  | { ok: true; redirectTo: string }
  | { ok: false; message: string };

const GENERIC = "Something went wrong. Please try again.";

function toMessage(
  error: unknown,
  byStatus: Partial<Record<number, string>> = {},
): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) return GENERIC;
    return byStatus[error.status] ?? error.messages[0] ?? GENERIC;
  }
  return "Can't reach the server. Please check your connection and try again.";
}

function splitFullName(fullName: string) {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

export async function loginAction(input: LoginValues): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: "Invalid email or password." };

  try {
    const { accessToken } = await authApi.login({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    const user = parseToken(accessToken);
    if (!user) return { ok: false, message: GENERIC };

    // The web app is for clinic staff only.
    if (!WEB_ROLES.includes(user.role as (typeof WEB_ROLES)[number])) {
      return {
        ok: false,
        message:
          "Patient accounts can't sign in here. Please use the mobile app.",
      };
    }

    await createSession(accessToken, user, parsed.data.remember);
    return {
      ok: true,
      redirectTo: HOME_BY_ROLE[user.role as keyof typeof HOME_BY_ROLE],
    };
  } catch (error) {
    return {
      ok: false,
      message: toMessage(error, {
        401: "Invalid credentials, or your account isn't activated yet.",
      }),
    };
  }
}

export async function registerClinicAction(
  input: RegisterClinicValues,
): Promise<ActionResult> {
  const parsed = registerClinicSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: "Please check the form and try again." };
  const { owner, clinic } = parsed.data;

  try {
    // 201 { accessToken } -> the owner token
    const { accessToken } = await authApi.registerClinic({
      clinic: {
        name: clinic.name,
        subDomain: clinic.subDomain,
        address: clinic.address,
        timezone: DEFAULT_TIMEZONE,
      },
      admin: {
        ...splitFullName(owner.fullName),
        email: owner.email,
        phone: clinic.phone.replace(/\s+/g, ""),
        password: owner.password,
      },
    });

    const user = parseToken(accessToken);
    if (!user) return { ok: false, message: GENERIC };

    await createSession(accessToken, user, false);
    return { ok: true, redirectTo: HOME_BY_ROLE.CLINIC_OWNER };
  } catch (error) {
    return {
      ok: false,
      message: toMessage(error, {
        409: "This clinic subdomain, email or phone number is already in use.",
      }),
    };
  }
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
