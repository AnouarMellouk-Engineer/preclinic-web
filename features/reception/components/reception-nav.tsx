"use client";

import { CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { RECEPTION_ROUTES } from "../constants";

const ITEMS = [
  { href: RECEPTION_ROUTES.bookings, label: "Bookings", icon: CalendarDays },
  { href: RECEPTION_ROUTES.waitingRoom, label: "Waiting room", icon: Users },
];

export function ReceptionNav({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();
  return (
    <ul
      className={cn(
        "flex gap-1",
        orientation === "vertical" ? "flex-col" : "flex-row",
      )}
    >
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
