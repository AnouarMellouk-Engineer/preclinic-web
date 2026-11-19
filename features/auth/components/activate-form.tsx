"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { activateAccountAction } from "../actions";
import { activateSchema, type ActivateValues } from "../schemas";
import { AuthCard } from "./auth-card";
import { FormError, FormField } from "./form-field";
import { PasswordInput } from "./password-input";

export function ActivateForm({ token }: { token: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ActivateValues>({
    resolver: zodResolver(activateSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = handleSubmit(async ({ password }) => {
    setServerError(null);
    const result = await activateAccountAction({ token, password });
    if (!result.ok) return setServerError(result.message);
    router.replace(result.redirectTo);
    router.refresh();
  });

  return (
    <AuthCard
      title="Set your password"
      description="Choose a password to activate your account"
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex w-full flex-col gap-5"
      >
        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            placeholder="************"
            autoComplete="new-password"
            autoFocus
            aria-invalid={!!errors.password}
            {...register("password")}
          />
        </FormField>

        <FormError message={serverError} />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-[38px] w-full"
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          Activate account
        </Button>
      </form>
    </AuthCard>
  );
}
