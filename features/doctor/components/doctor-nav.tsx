"use client";

import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { DOCTOR_ROUTES } from "../constants";

const ITEMS = [
  { href: DOCTOR_ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: DOCTOR_ROUTES.bookings, label: "Bookings", icon: CalendarDays },
  { href: DOCTOR_ROUTES.patients, label: "Patients", icon: Users },
  {
    href: DOCTOR_ROUTES.consultations,
    label: "Consultations",
    icon: ClipboardList,
  },
];

/** Same sidebar link pattern as the owner area (32px high, 10px radius, active = solid primary). */
export function DoctorNav({
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
