"use client";

/* eslint-disable @next/next/no-img-element */
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function OrDivider() {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[13px] leading-[19.5px] text-grey-500">OR</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

// Social sign-in isn't in the API yet: the buttons match the design but only show a notice.
export function SocialButtons() {
  return <div className="flex w-full gap-4"></div>;
}
