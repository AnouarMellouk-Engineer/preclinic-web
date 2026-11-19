import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-start rounded-card border border-border bg-white p-10 shadow-field">
      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-col gap-1 text-center">
          <h1 className="text-xl font-bold leading-6 text-grey-900">{title}</h1>
          <p className="text-sm leading-[21px] text-grey-500 opacity-70">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
