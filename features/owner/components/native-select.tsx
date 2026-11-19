import { ChevronDown, type LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Styled native <select> (no extra dependency; works with RHF `register`). */
export function NativeSelect({
  icon: Icon,
  className,
  children,
  ...props
}: ComponentProps<"select"> & { icon?: LucideIcon }) {
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      )}
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-[10px] border border-input bg-background pr-9 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive",
          Icon ? "pl-9" : "pl-3",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}
