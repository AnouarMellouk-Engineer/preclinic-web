import { DEFAULT_TIMEZONE } from "@/features/auth/constants";

export const DOCTOR_ROUTES = {
  dashboard: "/doctor/dashboard",
  bookings: "/doctor/bookings",
  patients: "/doctor/patients",
  consultations: "/doctor/consultations",
} as const;

export const BOOKING_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const RANGE_TABS = [
  { value: "", label: "All" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
] as const;

export const BOOKING_TONE = {
  PENDING: "warning",
  CONFIRMED: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
} as const;

const tz = DEFAULT_TIMEZONE;

/** YYYY-MM-DD in the clinic time zone. */
export const todayISO = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());

export function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("en", {
    timeZone: tz,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatTime(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("en", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export const formatDateTime = (value?: string | null) =>
  value ? `${formatDate(value)} · ${formatTime(value)}` : "-";

export function formatGender(value?: string | null) {
  if (!value) return "-";
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export const TEXTAREA_CLASS =
  "min-h-24 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";
