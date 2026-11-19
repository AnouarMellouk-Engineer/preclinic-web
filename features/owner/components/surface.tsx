import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Figma card: white, 1px #e1e7ef border, 12px radius, 0 1px 1px rgba(0,0,0,.05). */
export function Surface({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[12px] border bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]",
        className,
      )}
      {...props}
    />
  );
}
