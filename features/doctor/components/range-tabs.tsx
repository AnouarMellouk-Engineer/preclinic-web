import Link from "next/link";

import { cn } from "@/lib/utils";

import { RANGE_TABS } from "../constants";

/** All / Today / This week, stored in the URL (?range=...). Keeps the other params. */
export function RangeTabs({
  basePath,
  current,
  params,
}: {
  basePath: string;
  current: string;
  params: Record<string, string>;
}) {
  return (
    <div
      className="inline-flex gap-1 rounded-[10px] bg-muted p-1"
      role="tablist"
    >
      {RANGE_TABS.map((tab) => {
        const next = new URLSearchParams(params);
        if (tab.value) next.set("range", tab.value);
        else next.delete("range");
        const qs = next.toString();
        const active = current === tab.value;
        return (
          <Link
            key={tab.label}
            href={qs ? `${basePath}?${qs}` : basePath}
            role="tab"
            aria-selected={active}
            replace
            scroll={false}
            className={cn(
              "rounded-[8px] px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-white font-medium text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
