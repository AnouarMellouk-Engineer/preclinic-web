import type { Specialist } from "./constants";

export type StaffRole = "DOCTOR" | "RECEPTIONIST";

export type StaffMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
};

export type Doctor = StaffMember & {
  specialist: Specialist | null;
  /** Numeric string as returned by the API, e.g. "3000.00". */
  pricingPerConsultation: string | null;
};

export type Receptionist = StaffMember;

export type InviteStaffPayload = {
  role: StaffRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialist?: Specialist;
  pricingPerConsultation?: string;
};
