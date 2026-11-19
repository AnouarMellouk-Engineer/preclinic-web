"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type ComponentProps } from "react";

import { IconInput } from "./icon-input";

export function PasswordInput(
  props: Omit<ComponentProps<typeof IconInput>, "icon" | "type" | "rightSlot">,
) {
  const [visible, setVisible] = useState(false);
  const Toggle = visible ? Eye : EyeOff;

  return (
    <IconInput
      {...props}
      icon={Lock}
      type={visible ? "text" : "password"}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-900 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Toggle aria-hidden className="size-[14px]" />
        </button>
      }
    />
  );
}
