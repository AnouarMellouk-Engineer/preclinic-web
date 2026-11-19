import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type IconInputProps = ComponentProps<"input"> & {
  icon: LucideIcon;
  /** Absolutely positioned element on the right (password toggle, domain suffix...). */
  rightSlot?: ReactNode;
};

/** shadcn Input + 14px leading icon (Figma: px-12, gap-8, icon 14). Works with RHF `register`. */
export function IconInput({
  icon: Icon,
  rightSlot,
  className,
  ...props
}: IconInputProps) {
  return (
    <div className="relative w-full">
      <Icon
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-[14px] -translate-y-1/2 text-grey-900"
      />
      <Input
        className={cn(
          "pl-[34px] text-sm shadow-field placeholder:text-grey-300",
          rightSlot && "pr-[34px]",
          className,
        )}
        {...props}
      />
      {rightSlot}
    </div>
  );
}
