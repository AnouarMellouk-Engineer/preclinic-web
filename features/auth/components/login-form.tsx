"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { loginAction } from "../actions";
import { loginSchema, type LoginValues } from "../schemas";
import { AuthCard } from "./auth-card";
import { FormError, FormField } from "./form-field";
import { IconInput } from "./icon-input";
import { PasswordInput } from "./password-input";
import { OrDivider, SocialButtons } from "./social-buttons";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await loginAction(values);
    if (!result.ok) return setServerError(result.message);
    router.replace(result.redirectTo);
    router.refresh();
  });

  return (
    <AuthCard title="Login" description="Please enter your details to sign in">
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex w-full flex-col gap-5"
      >
        <FormField
          label="Email Address"
          htmlFor="email"
          error={errors.email?.message}
        >
          <IconInput
            id="email"
            type="email"
            icon={Mail}
            placeholder="Enter Email Address"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            placeholder="************"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
        </FormField>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="remember"
              render={({ field }) => (
                <Checkbox
                  id="remember"
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
              )}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal text-grey-500"
            >
              Remember me
            </Label>
          </div>
          {/* TODO: forgot-password page (not in the API yet) */}
          <Link href="#" className="text-sm text-primary underline">
            Forgot password?
          </Link>
        </div>

        <FormError message={serverError} />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-[38px] w-full"
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          Login
        </Button>

        <OrDivider />
        <SocialButtons />

        <p className="text-center text-sm leading-[21px] text-grey-900">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-primary">
            Register
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
