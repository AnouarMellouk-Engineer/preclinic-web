"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { ownerSchema, type OwnerValues } from "../schemas";
import { AuthCard } from "./auth-card";
import { FormField } from "./form-field";
import { IconInput } from "./icon-input";
import { PasswordInput } from "./password-input";
import { OrDivider, SocialButtons } from "./social-buttons";

export function OwnerStep({
  defaultValues,
  onNext,
}: {
  defaultValues?: OwnerValues;
  onNext: (values: OwnerValues) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: defaultValues ?? {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  return (
    <AuthCard
      title="Register"
      description="Please enter your details to create account"
    >
      <form
        onSubmit={handleSubmit((v) => onNext(v))}
        noValidate
        className="flex w-full flex-col gap-5"
      >
        <FormField
          label="Full Name"
          htmlFor="fullName"
          error={errors.fullName?.message}
        >
          <IconInput
            id="fullName"
            icon={User}
            placeholder="Enter Name"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
        </FormField>

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
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
        </FormField>

        <FormField
          label="Confirm Password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            placeholder="************"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </FormField>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="acceptTerms"
              render={({ field }) => (
                <Checkbox
                  id="acceptTerms"
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  aria-invalid={!!errors.acceptTerms}
                />
              )}
            />
            <Label
              htmlFor="acceptTerms"
              className="text-sm font-normal text-grey-500"
            >
              <span>
                I agree to the {/* TODO: point to the real legal pages */}
                <Link href="#" className="text-primary underline">
                  Terms of Service
                </Link>{" "}
                <span className="text-primary">&amp;</span>{" "}
                <Link href="#" className="text-primary underline">
                  Privacy Policy
                </Link>
              </span>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p role="alert" className="text-xs text-destructive">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Figma says "Register"; it's "Continue" here because clinic details come next. */}
        <Button type="submit" className="h-[38px] w-full">
          Continue
        </Button>

        <OrDivider />
        <SocialButtons />

        <p className="text-center text-sm leading-[21px] text-grey-900">
          Already have an account yet?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
