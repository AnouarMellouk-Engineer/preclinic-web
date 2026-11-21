export const RECEPTION_ROUTES = {
  bookings: "/reception/bookings",
  waitingRoom: "/reception/waiting-room",
} as const;

export const APPOINTMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const WAITING_STATUSES = [
  "WAITING",
  "IN_CONSULTATION",
  "COMPLETED",
] as const;
export type WaitingStatus = (typeof WAITING_STATUSES)[number];

export function formatStatus(value: string) {
  const t = value.replace(/_/g, " ").toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export const APPOINTMENT_STATUS_OPTIONS = APPOINTMENT_STATUSES.map((value) => ({
  value,
  label: formatStatus(value),
}));

export const APPOINTMENT_TONE = {
  PENDING: "warning",
  CONFIRMED: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
} as const;

export const WAITING_TONE = {
  WAITING: "warning",
  IN_CONSULTATION: "success",
  COMPLETED: "success",
} as const;

/** Allowed transitions from the receptionist's side. COMPLETED also creates the consultation. */
export const NEXT_STATUSES: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};
