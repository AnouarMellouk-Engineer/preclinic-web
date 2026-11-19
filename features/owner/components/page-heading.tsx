import type { ReactNode } from "react";

export function PageHeading({
  subtitle,
  title,
  action,
}: {
  subtitle: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-base text-muted-foreground">{subtitle}</p>
        <h1 className="text-[30px] leading-9 font-bold tracking-[-0.75px] text-foreground">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}
