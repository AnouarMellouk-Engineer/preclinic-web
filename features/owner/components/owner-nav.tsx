"use client";

import { ConciergeBell, Stethoscope } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { OWNER_ROUTES } from "../constants";

const ITEMS = [
  { href: OWNER_ROUTES.doctors, label: "Doctors", icon: Stethoscope },
  { href: OWNER_ROUTES.receptionists, label: "Receptionists", icon: ConciergeBell },
];

/** Figma sidebar link: 32px high, 10px radius, active = solid primary + white text. */
export function OwnerNav({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  const pathname = usePathname();
  return (
    <ul className={cn("flex gap-1", orientation === "vertical" ? "flex-col" : "flex-row")}>
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-8 items-center gap-2 rounded-[10px] p-2 text-sm whitespace-nowrap transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
