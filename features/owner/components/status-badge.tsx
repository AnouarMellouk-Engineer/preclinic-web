import { cn } from "@/lib/utils";

const TONES = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-alert/10 text-alert",
} as const;

/** Figma "Tags": pill, 12px semibold, 10% tinted background. */
export function StatusBadge({
  tone,
  children,
}: {
  tone: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-[10.8px] py-[2.8px] text-xs leading-4 font-semibold whitespace-nowrap",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}
