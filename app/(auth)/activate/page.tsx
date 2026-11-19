import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { inspectActivationToken } from "@/features/auth/activation";
import { ActivateForm } from "@/features/auth/components/activate-form";
import { AuthCard } from "@/features/auth/components/auth-card";

export const metadata: Metadata = { title: "Activate your account" };

const PROBLEMS = {
  missing: "This activation link is incomplete.",
  invalid: "This activation link is not valid.",
  expired: "This activation link has expired.",
} as const;

async function ActivateContent({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const state = inspectActivationToken(token);

  if (state !== "ok" || !token) {
    return (
      <AuthCard
        title="Activation link problem"
        description={PROBLEMS[state === "ok" ? "invalid" : state]}
      >
        <p className="text-center text-sm leading-[21px] text-grey-500">
          Ask your clinic owner to send you a new invitation, or{" "}
          <Link href="/login" className="text-primary">
            sign in
          </Link>{" "}
          if your account is already active.
        </p>
      </AuthCard>
    );
  }

  return <ActivateForm token={token} />;
}

// searchParams is runtime data: read it inside <Suspense> (cacheComponents).
export default function ActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <ActivateContent searchParams={searchParams} />
    </Suspense>
  );
}
