import type { AppointmentStatus, WaitingStatus } from "./constants";

export type Person = { firstName: string; lastName: string; phone: string };

export type Appointment = {
  id: string;
  startAt: string;
  status: AppointmentStatus;
  reason: string | null;
  patient: Person;
  doctor: Person & { specialist: string | null };
};

export type WaitingEntry = {
  id: string;
  status: WaitingStatus;
  since: string;
  patient: Person;
  doctor: Person;
};

export type DoctorOption = { id: string; name: string };
export type Slot = { value: string; label: string };
