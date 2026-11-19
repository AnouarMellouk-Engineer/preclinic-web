"use client";

import { Funnel, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

import { IconInput } from "@/features/auth/components/icon-input";

import { NativeSelect } from "./native-select";

type Filter = {
  param: string;
  allLabel: string;
  options: { value: string; label: string }[];
};

/** Search + optional filter, both stored in the URL (?q=...&specialist=...). */
export function TableToolbar({ placeholder, filter }: { placeholder: string; filter?: Filter }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row" aria-busy={pending}>
      <div className="w-full sm:w-80">
        <IconInput
          icon={Search}
          type="search"
          aria-label={placeholder}
          placeholder={placeholder}
          defaultValue={params.get("q") ?? ""}
          className="h-10 rounded-[10px] bg-background"
          onChange={(e) => {
            const value = e.target.value;
            clearTimeout(timer.current);
            timer.current = setTimeout(() => update("q", value.trim()), 300);
          }}
        />
      </div>
      {filter && (
        <div className="w-full sm:w-48">
          <NativeSelect
            icon={Funnel}
            aria-label={filter.allLabel}
            value={params.get(filter.param) ?? ""}
            onChange={(e) => update(filter.param, e.target.value)}
          >
            <option value="">{filter.allLabel}</option>
            {filter.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </NativeSelect>
        </div>
      )}
    </div>
  );
}
